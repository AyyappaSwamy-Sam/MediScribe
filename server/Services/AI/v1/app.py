from flask import Flask, request, jsonify
from flask_cors import CORS
from dropbox import Dropbox
from dropbox.files import WriteMode
import os
from datetime import datetime
import logging

import tempfile
import requests
from dotenv import load_dotenv
from transformers import pipeline
import torch
import numpy as np
from pydub import AudioSegment
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os

# MongoDB connection
MONGO_URI = "mongodb+srv://subhash:12@cluster0.h1e1a.mongodb.net/MediScribe?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client.get_database('MediScribe')
appointment_records = db.appointmentrecords

MODEL_NAME = "ylacombe/whisper-large-v3-turbo"
BATCH_SIZE = 8
FILE_LIMIT_MB = 100

load_dotenv()

device = 0 if torch.cuda.is_available() else "cpu"

pipe = pipeline(
    task="automatic-speech-recognition",
    model=MODEL_NAME,
    chunk_length_s=30,
    device=device,
)



app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY")  # Change this in production

CORS(app)


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Dropbox configuration

DROPBOX_ACCESS_TOKEN = os.getenv("DROPBOX_ACCESS_TOKEN")
dbx = Dropbox(DROPBOX_ACCESS_TOKEN)






# Function to save data to MongoDB
def save_to_mongodb(patient_id, summary, transcript, audio_path, structured_output, appointment_id):
    record = {
        "appointmentId": ObjectId(appointment_id),
        "patientId": ObjectId(patient_id),
        "summary": summary,
        "transcription": transcript,
        "structuredOutput": structured_output,  # Add the appropriate structured output
        "audioPath": audio_path,
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

def generate_summary(transcript):
    """
    Generate a summary from the transcript
    In a real application, you might want to use a more sophisticated summarization method
    """
    # This is a simple summary generator - replace with your preferred method
    #  transcript = request.json['transcript']

    # Call the remote endpoint to get the summarization
    url = 'http://192.168.32.184:5007/get-summary'  # Replace with the actual IP address of the other laptop
    data = {'conversation': transcript}
    response = requests.post(url, json=data)


    print("hello",response.json())
    if response.status_code == 200:
        summary = response.json()['summary']
        structured = response.json()['structured']
        print(summary)
        print(structured)
        return summary, structured
    else:
        return jsonify({'error': response.json()['error']}), response.status_code
    # words = transcript.split()
    # if len(words) > 50:
    #     summary = ' '.join(words[:50]) + '...'
    # else:
    #     summary = transcript
    # return summary


@app.route('/process-audio', methods=['POST'])
def process_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        audio = audio_file.read()
        audio_data = np.array(audio)
        print(audio_data.shape)
        # Load the audio file using pydub
        # audio = AudioSegment.from_file(audio_file, format=audio_file.filename.split('.')[-1])
        # audio_data = np.array(audio.get_array_of_samples())

        # Transcribe audio using Whisper
        result = pipe(audio, batch_size=BATCH_SIZE, return_timestamps=True,generate_kwargs={"language": "english"})
        
        transcript = result["text"]

        # Generate summary
        summary, structured = generate_summary(transcript)

            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({
        'transcript': transcript,
        'summary': summary,
        'structured': structured
    }), 200

@app.route('/save-to-dropbox', methods=['POST'])
def save_to_dropbox():
    try:
        # if 'audio' not in request.files:
        #     return jsonify({'error': 'No audio file provided'}), 400
        audio_file = request.files['audio']
        patient_id = request.form.get('patientId', 'unknown')
        transcript = request.form.get('transcript', '')
        summary = request.form.get('summary', '')
        structured_output = request.form.get('structuredOutput', '')
        appointment_id = request.form.get('appointmentId', '')


        structured_output = structured_output.replace('\\r', '').replace('\\n', '').replace('\r', '').replace('\n', '')



        # Create timestamp for folder name
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        
        # Create folder structure
        folder_path = create_dropbox_folder_structure(patient_id, timestamp)


        
        # # Save transcript
        # transcript_path = f"{folder_path}/transcript.txt"
        # dbx.files_upload(transcript.encode(), transcript_path, mode=WriteMode('overwrite'))
        
        # # Save summary
        # summary_path = f"{folder_path}/summary.txt"
        # dbx.files_upload(summary.encode(), summary_path, mode=WriteMode('overwrite'))
        
        # Get the audio file and save it
        audio_path = f"{folder_path}/recording.wav"
        # Ensure we're at the start of the file
        dbx.files_upload(
            audio_file.read(),
            audio_path,
            mode=WriteMode('overwrite')
        )

        print('appointment ID: ', appointment_id)
        print(patient_id)

        save_to_mongodb(patient_id, summary, transcript, audio_path, structured_output, appointment_id)
        
        
        
        
        # Note: In a real application, you'd need to handle the audio file upload here
        
        return jsonify({
            'message': 'Files saved successfully in Database'
            
        }), 200

    except Exception as e:
        logger.error(f"Error saving to Dropbox: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(port=5006)