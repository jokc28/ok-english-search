import os
import json
import time
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

AUDIO_DIR = "reels-audio"
TRANSCRIPT_DIR = "transcripts"
PROGRESS_FILE = "transcribe-progress.json"

os.makedirs(TRANSCRIPT_DIR, exist_ok=True)

# Load progress
if os.path.exists(PROGRESS_FILE):
    with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
        progress = json.load(f)
else:
    progress = {}

# Get all audio files
audio_files = sorted(
    [f for f in os.listdir(AUDIO_DIR) if f.endswith(('.m4a', '.mp4', '.wav', '.mp3'))],
    key=lambda x: int(os.path.splitext(x)[0])
)

print(f"Total audio files: {len(audio_files)}")
print(f"Already transcribed: {len(progress)}")

failed = []
count = 0

for i, filename in enumerate(audio_files):
    entry_id = os.path.splitext(filename)[0]

    if entry_id in progress:
        continue

    filepath = os.path.join(AUDIO_DIR, filename)
    filesize = os.path.getsize(filepath)

    if filesize < 1000:
        print(f"[{i+1}/{len(audio_files)}] Skip (too small): {filename} ({filesize}B)")
        failed.append({'id': entry_id, 'reason': 'file too small'})
        continue

    print(f"[{i+1}/{len(audio_files)}] Transcribing: {filename} ({filesize // 1024}KB)")

    try:
        with open(filepath, 'rb') as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text",
                prompt="This is a Korean-English bilingual educational video about English expressions. The speaker explains English expressions in Korean."
            )

        # Save individual transcript
        transcript_path = os.path.join(TRANSCRIPT_DIR, f"{entry_id}.txt")
        with open(transcript_path, 'w', encoding='utf-8') as f:
            f.write(transcript)

        progress[entry_id] = transcript
        count += 1

        preview = transcript[:80].replace('\n', ' ')
        print(f"  OK: {preview}...")

        if count % 10 == 0:
            with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
                json.dump(progress, f, ensure_ascii=False, indent=2)
            print(f"  [Progress saved: {len(progress)} transcribed]")

    except Exception as e:
        print(f"  ERROR: {e}")
        failed.append({'id': entry_id, 'reason': str(e)})

    time.sleep(1.2)

# Final save
with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
    json.dump(progress, f, ensure_ascii=False, indent=2)

with open('transcribe-failed.json', 'w', encoding='utf-8') as f:
    json.dump(failed, f, ensure_ascii=False, indent=2)

print(f"\nDone. Transcribed: {len(progress)}, New: {count}, Failed: {len(failed)}")
