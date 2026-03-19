import os
import json
import time
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

# Load data
with open('reels-data.json', 'r', encoding='utf-8') as f:
    entries = json.load(f)

with open('transcribe-progress.json', 'r', encoding='utf-8') as f:
    transcripts = json.load(f)

ENRICH_FILE = 'enrich-transcript-progress.json'
if os.path.exists(ENRICH_FILE):
    with open(ENRICH_FILE, 'r', encoding='utf-8') as f:
        enriched = json.load(f)
else:
    enriched = {}

print(f"Entries: {len(entries)}, Transcripts: {len(transcripts)}, Already enriched: {len(enriched)}")

failed = []
count = 0

for i, entry in enumerate(entries):
    eid = str(entry['id'])
    if eid in enriched:
        continue

    transcript = transcripts.get(eid, "")
    has_transcript = bool(transcript.strip())

    print(f"[{i+1}/{len(entries)}] id={eid} ({'transcript' if has_transcript else 'caption only'})")

    prompt = f"""You are processing data for a Korean English-learning Instagram Reel catalog (@ok.english.kr).

{"=== VIDEO TRANSCRIPT ===" + chr(10) + transcript + chr(10) if has_transcript else "(No transcript available)"}

=== CAPTION ===
situation_kr: {entry.get('situation_kr', '')}
expression_en: {entry.get('expression_en', '')}
description_kr: {entry.get('description_kr', '')}

=== TASK ===
Based on the transcript (primary source) and caption (secondary), identify the ACTUAL English expression being taught in this Reel.

Return ONLY a valid JSON object (no markdown, no backticks):

{{
  "expression_en": "The main English expression/phrase taught (exact natural form — e.g. 'take a rain check', 'I'm flattered'). If multiple expressions, pick the PRIMARY one. If unclear, return empty string.",
  "expression_meaning_kr": "Concise Korean meaning (max 15 chars)",
  "situation_kr": "When to use this — natural Korean phrase ending with ~할 때 / ~하는 경우 etc. Max 25 chars.",
  "description_kr": "1-2 sentence Korean usage note. Feel like a friend explaining. Max 80 chars.",
  "category": "Exactly ONE: 인사·소개, 일상대화, 감정·리액션, 요청·부탁, 의견·토론, 사과·감사, 비즈니스, 여행·외출, 관용구·슬랭, 문화·뉘앙스",
  "search_keywords_kr": ["4-6 Korean search keywords"],
  "search_keywords_en": ["2-4 English synonyms/related"],
  "difficulty": "beginner OR intermediate OR advanced",
  "confidence": "high if transcript clearly shows the expression, low if guessing"
}}

CRITICAL: The transcript is the TRUTH. Follow it over the caption. Do NOT hallucinate expressions."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.1
        )

        text = response.choices[0].message.content.strip()
        if text.startswith('```'):
            text = text.split('\n', 1)[1]
            text = text.rsplit('```', 1)[0]

        result = json.loads(text)
        enriched[eid] = result
        count += 1

        expr = result.get('expression_en', '?')
        conf = result.get('confidence', '?')
        print(f"  → {expr} [{conf}]")

        if count % 10 == 0:
            with open(ENRICH_FILE, 'w', encoding='utf-8') as f:
                json.dump(enriched, f, ensure_ascii=False, indent=2)
            print(f"  [Saved: {len(enriched)}]")

    except json.JSONDecodeError as e:
        print(f"  JSON ERROR: {e}")
        failed.append({'id': eid, 'reason': f'JSON parse: {e}'})
    except Exception as e:
        print(f"  ERROR: {e}")
        failed.append({'id': eid, 'reason': str(e)})

    time.sleep(0.5)

# Final save
with open(ENRICH_FILE, 'w', encoding='utf-8') as f:
    json.dump(enriched, f, ensure_ascii=False, indent=2)

with open('enrich-transcript-failed.json', 'w', encoding='utf-8') as f:
    json.dump(failed, f, ensure_ascii=False, indent=2)

print(f"\nDone. Enriched: {len(enriched)}, New: {count}, Failed: {len(failed)}")
