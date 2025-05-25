# from pymongo import MongoClient
# from datetime import datetime
# import os

# # MongoDB connection
# MONGO_URI = "mongodb+srv://subhash:12@cluster0.h1e1a.mongodb.net/MediScribe?retryWrites=true&w=majority&appName=Cluster0"
# client = MongoClient(MONGO_URI)
# db = client.get_database('MediScribe')
# appointment_records = db.appointmentrecords

# # Function to get all documents from the appointment_records collection
# def get_all_appointment_records():
#     records = appointment_records.find()
#     return list(records)

# # Fetch and print all documents
# all_records = get_all_appointment_records()
# for record in all_records:
#     print(record)

# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import json
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv


env_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=env_path)
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure OpenAI API
openai.api_key =  os.getenv('OPENAI_API') # Set this in your environment

# Configure MongoDB


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
    
    # Get response from OpenAI
    response = openai.chat.completions.create(
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
    app.run(debug=True, host='0.0.0.0', port=5009)