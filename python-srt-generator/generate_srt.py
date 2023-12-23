# Note: This script is designed to be run in a Jupyter notebook on Google Colab due to 
# issues with the 'aeneas' package installation, particularly on Mac devices.
# To use this script, execute the following code blocks in a Colab notebook:

# # Install 'espeak' dependency required by aeneas
# !apt-get install -qq libespeak-dev > /dev/null
# # Install 'aeneas' package from the devel branch
# !pip install -q https://codeload.github.com/readbeyond/aeneas/zip/devel
# # --------------------------------------------------- #
# # Check installation
# !python -m aeneas.diagnostics
# # --------------------------------------------------- #

# We appreciate any assistance with resolving these installation issues.


import json
import os
from aeneas.executetask import ExecuteTask
from aeneas.task import Task
from pathlib import Path

def generate_srt(number, word):

    file_name = f"{number}.{word}"
    audio_output_name = f"{file_name}.mp3"
    audio_file_path_absolute = Path.home() / "Desktop" / "blulexi-content" / audio_output_name
    text_file_path_absolute = Path.home() / "Desktop" / "blulexi-content" / f"{file_name}-words.txt"
    sync_map_file_path_absolute = Path.home() / "Desktop" / "blulexi-content" / f"{file_name}.json"
    str_output = Path.home() / "Desktop" / "blulexi-content" / f"{file_name}.srt"

    # create Task object
    config_string = u"task_language=eng|is_text_type=plain|os_task_file_format=json"
    task = Task(config_string=config_string)
    task.audio_file_path_absolute = str(audio_file_path_absolute)
    task.text_file_path_absolute = str(text_file_path_absolute)
    task.sync_map_file_path_absolute = str(sync_map_file_path_absolute)

    # process Task
    ExecuteTask(task).execute()

    # output sync map to file
    task.output_sync_map_file()

    # Loads the JSON data into a Python dictionary
    with open(sync_map_file_path_absolute, 'r') as f:
        data = json.load(f)

    # Helper function to convert time from seconds to SRT format
    def convert_time(time_string):
        hours, minutes, seconds = int(float(time_string) // 3600), int(float(time_string) % 3600 // 60), float(time_string) % 60
        return f"{hours:02}:{minutes:02}:{seconds:06.3f}".replace('.', ',')

    # Begin forming the SRT data
    srt_data = ""

    for idx, fragment in enumerate(data['fragments'], start=1):
        begin = convert_time(fragment['begin'])
        end = convert_time(fragment['end'])
        lines = "\n".join(fragment['lines'])
        srt_data += f"{idx}\n{begin} --> {end}\n{lines}\n\n"

    # Optionally, save the SRT data to a file
    with open(str(str_output), 'w') as file:
        file.write(srt_data)

    # Automatic download SRT file
    os.system(f"mv {str_output} {str(str_output)}")

    print(f"SRT file generated and saved to {str_output}.")

if __name__ == "__main__":
    # User input
    number = input("Enter the number: ")
    word = input("Enter the word: ")

    generate_srt(number=number, word=word)
