import subprocess
import json
import os
import time

# Load from pre-exported JSON (run: node -e '...' to generate reels-data.json)
with open('reels-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Filter entries with real URLs
entries = [e for e in data if 'UNKNOWN' not in e['reel_url'] and e['reel_url'].strip()]
print(f"Total entries with real URLs: {len(entries)}")

failed = []
downloaded = 0
skipped = 0

for i, entry in enumerate(entries):
    eid = str(entry['id'])
    output_path = f"reels-audio/{eid}.m4a"

    if os.path.exists(output_path) and os.path.getsize(output_path) > 500:
        skipped += 1
        continue

    print(f"[{i+1}/{len(entries)}] id={eid} {entry['reel_url']}")

    try:
        result = subprocess.run([
            'yt-dlp',
            '--extract-audio',
            '--audio-format', 'm4a',
            '--audio-quality', '5',
            '-o', output_path,
            '--no-playlist',
            '--socket-timeout', '30',
            '--retries', '3',
            '--quiet',
            entry['reel_url']
        ], capture_output=True, text=True, timeout=90)

        if result.returncode != 0:
            err = result.stderr[:200].strip()
            print(f"  ERROR: {err}")
            failed.append({'id': entry['id'], 'url': entry['reel_url'], 'error': err})
        else:
            downloaded += 1
            if downloaded % 20 == 0:
                print(f"  [Progress: {downloaded} downloaded, {len(failed)} failed]")
    except subprocess.TimeoutExpired:
        print(f"  TIMEOUT")
        failed.append({'id': entry['id'], 'url': entry['reel_url'], 'error': 'timeout'})
    except Exception as e:
        print(f"  EXCEPTION: {e}")
        failed.append({'id': entry['id'], 'url': entry['reel_url'], 'error': str(e)})

    time.sleep(1)

print(f"\nDone. Downloaded: {downloaded}, Skipped: {skipped}, Failed: {len(failed)}")

with open('download-failed.json', 'w', encoding='utf-8') as f:
    json.dump(failed, f, indent=2, ensure_ascii=False)
