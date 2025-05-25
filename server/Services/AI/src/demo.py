import os
from dotenv import load_dotenv

# Load environment variables from .env file

env_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=env_path)
# Get the OPENAI_API value
openai_api = os.getenv('MONGO_URI')

print(f'OPENAI_API: {openai_api}')