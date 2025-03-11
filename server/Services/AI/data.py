from pymongo import MongoClient
from datetime import datetime
import os

# MongoDB connection
MONGO_URI = "mongodb+srv://subhash:12@cluster0.h1e1a.mongodb.net/MediScribe?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client.get_database('MediScribe')
appointment_records = db.appointmentrecords

# Function to get all documents from the appointment_records collection
def get_all_appointment_records():
    records = appointment_records.find()
    return list(records)

# Fetch and print all documents
all_records = get_all_appointment_records()
for record in all_records:
    print(record)