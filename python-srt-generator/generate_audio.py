import json
from openai import OpenAI
import os
import shutil
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def generate_audio(number, word, raw_text_file_path):
    # Your API key
    API_KEY = os.getenv("OPENAI_API_KEY")

    file_name = f"{number}.{word}"
    audio_output_name = f"{file_name}.mp3"
    
    desktop_path = Path.home() / "Desktop"
    blulexi_content_folder = desktop_path / "blulexi-content"

    # Create "blulexi-content" folder if it doesn't exist
    blulexi_content_folder.mkdir(exist_ok=True)

    audio_file_path_absolute = blulexi_content_folder / audio_output_name

    # Read raw text from the file
    with open(raw_text_file_path, 'r') as file:
        raw_text = file.read()

    client = OpenAI(api_key=API_KEY)

    response = client.audio.speech.create(
        model="tts-1-hd",  # HD Voice
        voice="nova",  # Model Voice
        speed=0.96,  # 0.25 to 4 - CHANGING PACE MAY RESULT IN POOR VOICE QUALITY
        input=raw_text,
    )

    response.stream_to_file(str(audio_file_path_absolute))

    print(f"Audio file generated and saved to {audio_file_path_absolute}.")

if __name__ == "__main__":
    # User input
    number = input("Enter the number: ")
    word = input("Enter the word: ")

    raw_text_file_path = input("Enter the path to the file containing raw text: ")

    generate_audio(number=number, word=word, raw_text_file_path=raw_text_file_path)
