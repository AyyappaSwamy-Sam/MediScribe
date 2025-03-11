import os
import re
import json
import logging
import numpy as np
import assemblyai as aai
from datetime import datetime
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
from dropbox import Dropbox
from dropbox.files import WriteMode
from openai import OpenAI
from flask_cors import CORS


MONGO_URI = "mongodb+srv://subhash:12@cluster0.h1e1a.mongodb.net/MediScribe?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client.get_database('MediScribe')
appointment_records = db.appointmentrecords

FILE_LIMIT_MB = 100

load_dotenv()

# AssemblyAI configuration
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY", "7d083f65d8d94421bd1a1bf5358d1530")

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

def generate_soap_summary(transcript):
    """Generate a SOAP note summary using OpenAI's GPT-4o-mini"""
    try:
        openai_api_key = "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"
        client = OpenAI(api_key=openai_api_key)
        
        full_prompt = system_prompt + transcript
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a medical assistant that creates professional SOAP notes from medical conversations."},
                {"role": "user", "content": full_prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error generating SOAP summary: {str(e)}")
        return "Failed to generate SOAP summary"

def generate_structured_output(transcript):
    """Generate structured clinical output using OpenAI's GPT-4o-mini"""
    try:
        openai_api_key = "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"
        client = OpenAI(api_key=openai_api_key)
        
        full_prompt = structured_prompt + transcript
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a medical documentation specialist that extracts structured information from medical conversations."},
                {"role": "user", "content": full_prompt}
            ],
            temperature=0.2,
            max_tokens=1000
        )
        
        structured_text = response.choices[0].message.content.strip()
        
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
        temp_file_path = "temp_audio.wav"
        audio_file.save(temp_file_path)
        
        # Use AssemblyAI for transcription
        transcriber = aai.Transcriber()
        config = aai.TranscriptionConfig(speaker_labels=True)
        transcript_result = transcriber.transcribe(temp_file_path, config=config)
        
        # Get speaker count and format transcript
        speaker_count = len(set([u.speaker for u in transcript_result.utterances]))
        
        # Format transcript with speaker labels
        formatted_transcript = ""
        for utterance in transcript_result.utterances:
            formatted_transcript += f"Speaker {utterance.speaker}: {utterance.text}\n"
        
        # Remove temporary file
        os.remove(temp_file_path)

        print("COmpleted transcription")
        
        # Generate SOAP summary
        soap_summary = generate_soap_summary(formatted_transcript)

        print("Completed summary: ", soap_summary)
        
        # Generate structured output
        structured_output = generate_structured_output(formatted_transcript)

        print("Completed Structured output: ", structured_output)
            
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

    return jsonify({
        'transcript': formatted_transcript,
        'summary': soap_summary,
        'structured': structured_output,
        'speakerCount': speaker_count
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