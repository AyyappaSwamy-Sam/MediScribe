import os
import re
import json
import logging
import base64
from datetime import datetime
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
from dropbox import Dropbox
from dropbox.files import WriteMode
from flask_cors import CORS
import google.generativeai as genai
import tempfile
import requests
from dotenv import load_dotenv



env_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=env_path)
MONGO_URI = "mongodb+srv://subhash:12@cluster0.h1e1a.mongodb.net/MediScribe?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client.get_database('MediScribe')
appointment_records = db.appointmentrecords

FILE_LIMIT_MB = 100

load_dotenv()

# Google Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Maximum file size for direct processing
MAX_AUDIO_SIZE_MB = 20  # Gemini has limits on audio file size

# Dropbox configuration
DROPBOX_ACCESS_TOKEN = os.getenv("DROPBOX_ACCESS_TOKEN")
dbx = Dropbox(DROPBOX_ACCESS_TOKEN)

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")  # Change this in production
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# SOAP Note Generation Prompt
system_prompt = """Create a Medical SOAP note summary from the dialogue, following these guidelines: S (Subjective): 
                    Summarize the patient's reported symptoms, including chief complaint and relevant history. Rely on the patient's statements as the primary source and 
                    ensure standardized terminology. O (Objective): Highlight critical findings such as vital signs, lab results, and imaging, emphasizing important 
                    details like the side of the body affected and specific dosages. Include normal ranges where relevant. 
                    A (Assessment): Offer a concise assessment combining subjective and objective data. 
                    State the primary diagnosis and any differential diagnoses, noting potential complications and the prognostic outlook. 
                    P (Plan): Outline the management plan, covering medication, diet, consultations, and education.
                    Ensure to mention necessary referrals to other specialties and address compliance challenges. 
                    Considerations: Compile the report based solely on the transcript provided. Maintain confidentiality and document sensitively.
                    Use concise medical jargon and abbreviations for effective doctor communication. 
                    Please format the summary in a clean, simple list format without using markdown or bullet points. Use 'S:', 'O:', 'A:', 'P:' directly followed by the text. 
                    Avoid any styling or special characters.
                    Important: Be thorough and identify ALL health issues and problems mentioned by the patient, even if they seem minor.
                Given Context :
"""

# Structured Clinical Summary Prompt
structured_prompt = """You are a medical documentation specialist. Please analyze the provided doctor-patient conversation and create a structured clinical summary.

Guidelines:
1. Extract ONLY information explicitly stated in the conversation
2. Do not make assumptions or infer information
3. Never break the JSON format regardless of input quality
4. Use exactly "None" (not null, not "Not discussed", not empty string) for any missing/unclear information
5. Mark any ambiguous statements as "Unclear"
6. Include direct quotes where relevant
7. Always return a consistent JSON response. Never include comments or explanations within JSON

Please output the analysis in the following JSON format:

{
   
    "Chief_Complaint": "",
    "Symptoms": "",
    "Physical_Examination": "",
    "Diagnosis": "",
    "Medications":"",
    "Treatment_Plan": "",
    "Lifestyle_Modifications": {
        "Diet": {
            "Recommended": "",
            "Restricted": ""
        },
        "Exercise": "",
        "Other_Recommendations": ""
    },
    "Follow_up": {
        "Timing": "",
        "Special_Instructions": ""
    },
    
    "Additional_Notes": ""
}

Given Context : \n
"""

def save_to_mongodb(patient_id, summary, transcript, audio_path, structured_output, appointment_id, speaker_count):
    """Save all data to MongoDB"""
    record = {
        "appointmentId": ObjectId(appointment_id),
        "patientId": ObjectId(patient_id),
        "summary": summary,
        "transcription": transcript,
        "structuredOutput": structured_output,
        "audioPath": audio_path,
        "speakerCount": speaker_count,
        "savedTime": datetime.now().strftime('%H:%M:%S'),
        "savedDate": datetime.now()
    }
    appointment_records.insert_one(record)

def create_dropbox_folder_structure(patient_id, timestamp):
    """Create the folder structure in Dropbox"""
    base_path = f"/Patients/{patient_id}/{timestamp}"
    try:
        dbx.files_create_folder_v2(base_path)
        return base_path
    except Exception as e:
        logger.error(f"Error creating folder structure: {str(e)}")
        raise

def transcribe_audio_with_gemini(audio_file_path):
    """
    Transcribes audio using Gemini AI with speaker identification
    and language detection/translation capabilities
    """
    try:
        # Read the audio file
        with open(audio_file_path, "rb") as f:
            audio_data = f.read()
        
        file_size_mb = len(audio_data) / (1024 * 1024)
        if file_size_mb > MAX_AUDIO_SIZE_MB:
            logger.warning(f"Audio file size ({file_size_mb:.2f}MB) exceeds recommended limit for Gemini")
        
        # Configure the Gemini model for transcription with speaker diarization
        generation_config = {
            "temperature": 0.2,
            "top_p": 1.0,
            "top_k": 32,
            "max_output_tokens": 8192,
        }
        
        # Create the model
        model = genai.GenerativeModel(model_name="gemini-2.0-flash", generation_config=generation_config)
        
        # Create prompt for transcription with speaker identification and language detection
        prompt = """
        Please transcribe the given audio accurately with the following requirements:
        1. Identify and number each speaker (e.g., "Speaker 1:", "Speaker 2:")
        2. If the audio is in a language other than English, please identify the language and translate the content to English
        3. Maintain all medical terminology and jargon
        4. Preserve natural pauses and conversation flow
        5. Format the output with each speaker's dialogue on a new line prefixed with their speaker number
        6. At the end, state the total number of identified speakers and the detected language
        
        Format the transcript exactly as:
        Speaker 1: [transcribed text]
        Speaker 2: [transcribed text]
        ...
        
        End with:
        ---
        Number of speakers: [number]
        Detected language: [language]
        """
        
        # Process audio content with Gemini
        response = model.generate_content([prompt, {"mime_type": "audio/wav", "data": audio_data}])
        
        # Process the response
        full_response = response.text
        
        # Extract transcript and metadata
        transcript_parts = full_response.split("---")
        formatted_transcript = transcript_parts[0].strip()
        
        # Extract number of speakers and detected language from metadata
        metadata = transcript_parts[1] if len(transcript_parts) > 1 else ""
        
        # Parse speaker count
        speaker_count_match = re.search(r"Number of speakers:\s*(\d+)", metadata)
        speaker_count = int(speaker_count_match.group(1)) if speaker_count_match else 2
        
        # Parse detected language
        language_match = re.search(r"Detected language:\s*([^\n]+)", metadata)
        detected_language = language_match.group(1).strip() if language_match else "English"
        
        return {
            "transcript": formatted_transcript,
            "speaker_count": speaker_count,
            "detected_language": detected_language
        }
    
    except Exception as e:
        logger.error(f"Error in transcription with Gemini: {str(e)}")
        
        # Fallback to a simpler transcription approach if needed
        try:
            model = genai.GenerativeModel(model_name="gemini-2.0-flash")
            with open(audio_file_path, "rb") as f:
                audio_data = f.read()
            
            response = model.generate_content([
                "Transcribe this audio file. If it's not in English, please translate it to English.",
                {"mime_type": "audio/wav", "data": audio_data}
            ])
            
            return {
                "transcript": response.text,
                "speaker_count": 2,  # Default assumption
                "detected_language": "Unknown" 
            }
        except Exception as fallback_error:
            logger.error(f"Fallback transcription also failed: {str(fallback_error)}")
            raise

def generate_gemini_response(prompt, transcript, model="gemini-2.0-flash-001"):
    """Generate a response using Google Gemini AI"""
    try:
        # Configure the Gemini model
        generation_config = {
            "temperature": 0.3,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        # Create the model
        model = genai.GenerativeModel(model_name=model, generation_config=generation_config)
        
        # Full prompt with context
        full_prompt = prompt + transcript
        
        # Generate the response
        response = model.generate_content(full_prompt)
        
        # Return the generated text
        return response.text
    
    except Exception as e:
        logger.error(f"Error generating Gemini response: {str(e)}")
        raise

def generate_soap_summary(transcript):
    """Generate a SOAP note summary using Google Gemini"""
    try:
        return generate_gemini_response(system_prompt, transcript)
    except Exception as e:
        logger.error(f"Error generating SOAP summary: {str(e)}")
        return "Failed to generate SOAP summary"

def generate_structured_output(transcript):
    """Generate structured clinical output using Google Gemini"""
    try:
        structured_text = generate_gemini_response(structured_prompt, transcript)
        
        # Ensure we have valid JSON
        try:
            json_object = json.loads(structured_text)
            return json.dumps(json_object)
        except json.JSONDecodeError:
            logger.error("Failed to parse structured output as JSON")
            # Return a default structure if parsing fails
            default_structure = {
                "Chief_Complaint": "None",
                "Symptoms": "None",
                "Physical_Examination": "None",
                "Diagnosis": "None",
                "Medications": "None",
                "Treatment_Plan": "None",
                "Lifestyle_Modifications": {
                    "Diet": {
                        "Recommended": "None",
                        "Restricted": "None"
                    },
                    "Exercise": "None",
                    "Other_Recommendations": "None"
                },
                "Follow_up": {
                    "Timing": "None",
                    "Special_Instructions": "None"
                },
                "Additional_Notes": "Error processing transcript"
            }
            return json.dumps(default_structure)
    except Exception as e:
        logger.error(f"Error generating structured output: {str(e)}")
        default_structure = {
            "Chief_Complaint": "None",
            "Symptoms": "None",
            "Physical_Examination": "None",
            "Diagnosis": "None",
            "Medications": "None",
            "Treatment_Plan": "None",
            "Lifestyle_Modifications": {
                "Diet": {
                    "Recommended": "None",
                    "Restricted": "None"
                },
                "Exercise": "None",
                "Other_Recommendations": "None"
            },
            "Follow_up": {
                "Timing": "None",
                "Special_Instructions": "None"
            },
            "Additional_Notes": f"Error: {str(e)}"
        }
        return json.dumps(default_structure)

@app.route('/process-audio', methods=['POST'])
def process_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            temp_file_path = temp_file.name
            audio_file.save(temp_file_path)
        
        # Use Gemini for transcription
        transcription_result = transcribe_audio_with_gemini(temp_file_path)
        
        # Get transcript and speaker count
        formatted_transcript = transcription_result["transcript"]
        speaker_count = transcription_result["speaker_count"]
        detected_language = transcription_result.get("detected_language", "English")
        
        # Remove temporary file
        os.remove(temp_file_path)

        logger.info("Completed transcription with Gemini")
        logger.info(f"Detected language: {detected_language}")
        logger.info(f"Identified speakers: {speaker_count}")
        
        # Generate SOAP summary
        soap_summary = generate_soap_summary(formatted_transcript)
        logger.info("Completed summary")
        
        # Generate structured output
        structured_output = generate_structured_output(formatted_transcript)
        logger.info("Completed Structured output")
            
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

    return jsonify({
        'transcript': formatted_transcript,
        'summary': soap_summary,
        'structured': structured_output,
        'speakerCount': speaker_count,
        'detectedLanguage': detected_language
    }), 200

@app.route('/save-to-dropbox', methods=['POST'])
def save_to_dropbox():
    try:
        audio_file = request.files['audio']
        patient_id = request.form.get('patientId', 'unknown')
        transcript = request.form.get('transcript', '')
        summary = request.form.get('summary', '')
        structured_output = request.form.get('structuredOutput', '')
        appointment_id = request.form.get('appointmentId', '')
        speaker_count = request.form.get('speakerCount', 0)

        structured_output = structured_output.replace('\\r', '').replace('\\n', '').replace('\r', '').replace('\n', '')

        # Create timestamp for folder name
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Create folder structure
        folder_path = create_dropbox_folder_structure(patient_id, timestamp)
        
        # Get the audio file and save it
        audio_path = f"{folder_path}/recording.wav"
        dbx.files_upload(
            audio_file.read(),
            audio_path,
            mode=WriteMode('overwrite')
        )

        save_to_mongodb(patient_id, summary, transcript, audio_path, structured_output, appointment_id, speaker_count)
        
        return jsonify({
            'message': 'Files saved successfully in Database',
            'speakerCount': speaker_count
        }), 200

    except Exception as e:
        logger.error(f"Error saving to Dropbox: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(port=5006)
