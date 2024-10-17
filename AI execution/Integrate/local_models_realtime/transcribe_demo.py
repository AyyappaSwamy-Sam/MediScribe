import argparse
import os
import numpy as np
import speech_recognition as sr
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import gradio as gr
from datetime import datetime, timedelta
from queue import Queue
from time import sleep
from sys import platform
import soundfile as sf

def load_model(model_name):
    processor = WhisperProcessor.from_pretrained(model_name)
    model = WhisperForConditionalGeneration.from_pretrained(model_name)
    return processor, model

def transcribe(audio_np, processor, model):
    input_features = processor(audio_np, sampling_rate=16000, return_tensors="pt").input_features
    predicted_ids = model.generate(input_features)
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)
    return transcription[0]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="ylacombe/whisper-large-v3-turbo", help="Model to use from Hugging Face")
    parser.add_argument("--energy_threshold", default=1000, help="Energy level for mic to detect.", type=int)
    parser.add_argument("--record_timeout", default=2, help="How real time the recording is in seconds.", type=float)
    parser.add_argument("--phrase_timeout", default=3, help="How much empty space between recordings before we consider it a new line in the transcription.", type=float)
    parser.add_argument("--default_microphone", default=None, help="Default microphone name for SpeechRecognition. Run this with 'list' to view available Microphones.", type=str)
    args = parser.parse_args()

    # Load model from Hugging Face
    processor, audio_model = load_model(args.model)

    # The last time a recording was retrieved from the queue.
    phrase_time = None
    # Thread safe Queue for passing data from the threaded recording callback.
    data_queue = Queue()
    # We use SpeechRecognizer to record our audio because it has a nice feature where it can detect when speech ends.
    recorder = sr.Recognizer()
    recorder.energy_threshold = args.energy_threshold
    # Definitely do this, dynamic energy compensation lowers the energy threshold dramatically to a point where the SpeechRecognizer never stops recording.
    recorder.dynamic_energy_threshold = False

    # Get list of available microphones
    mic_list = sr.Microphone.list_microphone_names()
    
    if args.default_microphone == 'list':
        print("Available microphone devices are: ")
        for index, name in enumerate(mic_list):
            print(f"Microphone with name \"{name}\" found")
        return
    
    # Try to use the specified microphone, if provided
    source = None
    if args.default_microphone:
        for index, name in enumerate(mic_list):
            if args.default_microphone.lower() in name.lower():
                source = sr.Microphone(sample_rate=16000, device_index=index)
                break
        
        if source is None:
            print(f"Error: Specified microphone '{args.default_microphone}' not found. Available options are:")
            for name in mic_list:
                print(f"- {name}")
            return

    # If no microphone is specified or found, use the default
    if source is None:
        try:
            source = sr.Microphone(sample_rate=16000)
            print("Using default microphone.")
        except OSError as e:
            print(f"Error accessing the default microphone: {str(e)}")
            print("Available microphones are:")
            for name in mic_list:
                print(f"- {name}")
            return

    # Adjust the recognizer sensitivity to ambient noise and record audio from the microphone
    try:
        with source:
            recorder.adjust_for_ambient_noise(source)
    except OSError as e:
        print(f"Error adjusting for ambient noise: {str(e)}")
        print("Please make sure your microphone is properly connected and not in use by another application.")
        return

    # Important for linux users.
    # Prevents permanent application hang and crash by using the wrong Microphone
    if 'linux' in platform:
        mic_name = args.default_microphone
        if not mic_name or mic_name == 'list':
            print("Available microphone devices are: ")
            for index, name in enumerate(sr.Microphone.list_microphone_names()):
                print(f"Microphone with name \"{name}\" found")
            return
        else:
            for index, name in enumerate(sr.Microphone.list_microphone_names()):
                if mic_name in name:
                    source = sr.Microphone(sample_rate=16000, device_index=index)
                    break
    else:
        source = sr.Microphone(sample_rate=16000)

    # Adjust the recognizer sensitivity to ambient noise and record audio from the microphone
    with source:
        recorder.adjust_for_ambient_noise(source)

    def record_callback(_, audio:sr.AudioData) -> None:
        """
        Threaded callback function to receive audio data when recordings finish.
        audio: An AudioData containing the recorded bytes.
        """
        # Grab the raw bytes and push it into the thread safe queue.
        data = audio.get_raw_data()
        data_queue.put(data)

    # Create a background thread that will pass us raw audio bytes.
    # We could do this manually but SpeechRecognizer provides a nice helper.
    recorder.listen_in_background(source, record_callback, phrase_time_limit=args.record_timeout)

    # Cue the user that we're ready to go.
    print("Model loaded.\n")

    transcription = ['']
    audio_data_list = []

    def update_transcription(audio_data):
        nonlocal transcription, audio_data_list, phrase_time

        now = datetime.utcnow()
        if not audio_data:
            return "\n".join(transcription)

        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
        audio_data_list.append(audio_np)

        text = transcribe(audio_np, processor, audio_model)

        if phrase_time and now - phrase_time > timedelta(seconds=args.phrase_timeout):
            transcription.append(text)
        else:
            transcription[-1] = text

        phrase_time = now

        return "\n".join(transcription)

    def save_audio():
        if not audio_data_list:
            return "No audio data to save."
        
        full_audio = np.concatenate(audio_data_list)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"recorded_audio_{timestamp}.wav"
        sf.write(filename, full_audio, 16000)
        return f"Audio saved as {filename}"

    iface = gr.Interface(
        fn=update_transcription,
        inputs=gr.Audio(source="microphone", streaming=True),
        outputs=[gr.Textbox(label="Transcription", lines=10)],
        live=True,
        title="Real-time Speech Transcription",
        description="Speak into your microphone to see the transcription in real-time.",
        allow_flagging="never",
    )

    save_button = gr.Button("Save Audio")
    save_button.click(fn=save_audio, outputs=gr.Textbox(label="Save Status"))

    iface.launch()

if __name__ == "__main__":
    main()