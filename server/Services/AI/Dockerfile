# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY requirements.txt .


RUN apt-get update && apt-get install -y ffmpeg

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt


COPY . .

# Make port 5006 available to the world outside this container
EXPOSE 5006

# Define environment variable

# Run app.py when the container launches
CMD ["python3", "src/app1.py"]

# CMD ["python3", "v1/run.py"]