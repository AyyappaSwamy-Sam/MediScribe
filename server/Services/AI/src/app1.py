import os
import re
import json
import logging
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
from dotenv import load_dotenv


env_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv('MONGO_URI')

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
        openai_api_key = os.getenv('OPENAI_API')
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
        openai_api_key = os.getenv('OPENAI_API')
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

        print("Completed transcription")
        
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




# System prompt to guide the AI responses
SYSTEM_PROMPT = """
You are the customer support AI for Mediscribe, a healthcare service that:
1. Records patient-doctor conversations in offline mode
2. Transcribes these conversations
3. Summarizes and structures the conversations
4. Saves data 
5. Allows patients to book appointments through the portal

Be helpful, professional, and concise. If users ask questions outside of Mediscribe's functionality:
- Politely clarify what Mediscribe can and cannot do
- Redirect to relevant support resources when appropriate
- Never share user data or sensitive information
- Avoid discussing politics, controversial topics, or giving medical advice
- Always suggest contacting human support for complex issues or account-specific questions

Common issues you can help with:
- How to book/reschedule/cancel appointments
- Questions about recording conversations
- How to access transcriptions and summaries
- Account troubleshooting
- Privacy and data security questions
"""

# Knowledge base for common questions
KNOWLEDGE_BASE = {
    "appointment": {
        "booking": "To book an appointment, log in to your Mediscribe account, click on 'Book Appointment', select your doctor, choose an available time slot, and confirm your booking.",
        "rescheduling": "To reschedule, go to 'My Appointments', find the appointment you want to change, click 'Reschedule', and select a new available time.",
        "cancellation": "To cancel, go to 'My Appointments', find the appointment you want to cancel, and click 'Cancel'. Please note our 24-hour cancellation policy."
    },
    "recording": {
        "how_to": "To record a conversation, use the Mediscribe app during your appointment. Tap the 'Record' button before the consultation begins. The recording works offline.",
        "privacy": "All recordings are encrypted and stored securely. Only you and your authorized healthcare providers can access them.",
        "retrieval": "Your recordings can be accessed in the 'My Recordings' section of your account. They're typically available within 1-2 hours after the appointment."
    },
    "transcription": {
        "access": "Transcriptions are available in the 'My Transcriptions' section, usually within 2-4 hours after recording.",
        "accuracy": "Our AI provides approximately 95% accuracy. You can report any inaccuracies by clicking 'Report Issue' next to any transcription.",
        "languages": "Mediscribe currently supports English, Spanish, French, German, and Mandarin Chinese."
    },
    "technical": {
        "login_issues": "If you're having trouble logging in, try resetting your password. If problems persist, contact support@mediscribe.com with details of the issue.",
        "app_problems": "For app issues, ensure you have the latest version installed. Try restarting the app or your device. Clear the cache if problems persist."
    },
    "account": {
        "creation": "To create an account, download the Mediscribe app or visit mediscribe.com and click 'Sign Up'. You'll need to provide basic information and verify your email.",
        "deletion": "To delete your account, go to Settings > Account > Delete Account. Please note that this action is permanent."
    },
    "data": {
        "security": "Mediscribe uses end-to-end encryption for all data. We comply with HIPAA regulations and never share your information without explicit consent.",
        "export": "You can export your data in the Settings > Data > Export section. Data is provided in PDF and JSON formats."
    }
}

@app.route('/api/support/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    conversation_id = data.get('conversationId', None)
    user_id = data.get('userId', 'anonymous')

    # Check knowledge base for quick responses
    direct_answer = check_knowledge_base(user_message)
    
    # Prepare messages for OpenAI
    openai_messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]
    
    # Add conversation history (limit to last 10 messages to save tokens)
    
    # openai_messages.append({"role": msg["role"], "content": msg["content"]})
    
    # If we found a direct answer, add it as context for the AI
    print(direct_answer, user_message)
    if direct_answer:
        openai_messages.append({
            "role": "system", 
            "content": f"You may use this information to answer: {direct_answer} || User Question : {user_message}"

        })
    
    openai_messages.append({
            "role": "system", 
            "content": f"User Question : {user_message}"

        })
    
    openai_api_key = os.getenv('OPENAI_API')
    client = OpenAI(api_key=openai_api_key)
    
    # Get response from OpenAI
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=openai_messages,
        max_tokens=500,
        temperature=0.7
    )
    
    ai_message = response.choices[0].message.content
    
   
    
    return jsonify({
        'message': ai_message,
        'conversationId': conversation_id
    })

def check_knowledge_base(query):
    """Check if the query matches any entries in our knowledge base"""
    query = query.lower()
    
    # Simple keyword matching
    for category, subcategories in KNOWLEDGE_BASE.items():
        if category in query:
            for subcategory, answer in subcategories.items():
                if subcategory in query:
                    return answer

    return None

@app.route('/api/support/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    conversation_id = data.get('conversationId')
    feedback = data.get('feedback')
    rating = data.get('rating')
    
    if not conversation_id:
        return jsonify({'error': 'Conversation ID is required'}), 400
    

    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5006)