import json
import os
import re
import ssl
import sys
import urllib.parse
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


INSTAGRAM_USERNAME = "ok.english.kr"
INSTAGRAM_APP_ID = "936619743392459"
DATA_PATHS = [Path("data.js"), Path("public/data.js")]


def load_dotenv():
    env_path = Path(".env")
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key, value.strip().strip('"').strip("'"))


def http_json(url, headers=None, payload=None):
    req = urllib.request.Request(url, headers=headers or {})
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        req.add_header("Content-Type", "application/json")
        req.data = body
    try:
        response = urllib.request.urlopen(req, timeout=30)
    except (ssl.SSLCertVerificationError, urllib.error.URLError) as exc:
        if "CERTIFICATE_VERIFY_FAILED" not in str(exc):
            raise
        response = urllib.request.urlopen(
            req, timeout=30, context=ssl._create_unverified_context()
        )
    with response:
        return json.loads(response.read().decode("utf-8"))


def fetch_public_feed():
    url = (
        f"https://www.instagram.com/api/v1/feed/user/"
        f"{INSTAGRAM_USERNAME}/username/?count=12"
    )
    return http_json(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "X-IG-App-ID": INSTAGRAM_APP_ID,
        },
    )


def parse_data_js(path):
    text = path.read_text(encoding="utf-8")
    data_match = re.search(
        r"const REELS_DATA\s*=\s*(\[.*?\]);\s*(?:const CATEGORIES|$)",
        text,
        re.S,
    )
    cat_match = re.search(r"const CATEGORIES\s*=\s*(\[.*\]);\s*$", text, re.S)
    if not data_match or not cat_match:
        raise ValueError(f"Could not parse {path}")
    return json.loads(data_match.group(1)), json.loads(cat_match.group(1))


def write_data_js(entries, categories):
    content = (
        "const REELS_DATA = "
        + json.dumps(entries, ensure_ascii=False, indent=2)
        + ";\n\nconst CATEGORIES = "
        + json.dumps(categories, ensure_ascii=False, indent=2)
        + ";\n"
    )
    for path in DATA_PATHS:
        path.write_text(content, encoding="utf-8")


def date_from_item(item):
    taken_at = item.get("taken_at")
    if not taken_at and item.get("device_timestamp"):
        taken_at = item["device_timestamp"] / 1_000_000
    if not taken_at:
        return ""
    return datetime.fromtimestamp(taken_at, tz=timezone.utc).date().isoformat()


def normalize_caption(text):
    return re.sub(r"\s+", " ", text or "").strip()


def derive_entry_from_known_caption(item, caption):
    code = item.get("code")
    url = f"https://www.instagram.com/reel/{code}/"
    date = date_from_item(item)

    if "Put yourself out there" in caption:
        return {
            "expression_en": "Put yourself out there",
            "expression_meaning_kr": "적극적으로 나서다",
            "situation_kr": "용기를 내서 사람 만날 때",
            "description_kr": "새로운 사람을 만나거나 기회를 잡으려고 안전지대 밖으로 나설 때 쓰는 표현이에요.",
            "category": "일상대화",
            "search_keywords_kr": ["용기", "사람 만나기", "밖에 나가다", "적극적", "도전"],
            "search_keywords_en": ["put yourself out there", "meet people", "take a chance"],
            "difficulty": "intermediate",
            "reel_url": url,
            "date": date,
        }

    if "squeeze in" in caption:
        return {
            "expression_en": "squeeze in",
            "expression_meaning_kr": "시간을 끼워 넣다",
            "situation_kr": "바쁜 와중에 시간을 낼 때",
            "description_kr": "일정이 꽉 찼지만 어떻게든 시간을 만들어 넣을 때 자연스럽게 쓰는 표현이에요.",
            "category": "일상대화",
            "search_keywords_kr": ["시간 내다", "바쁠 때", "일정", "끼워 넣다", "운동"],
            "search_keywords_en": ["squeeze in", "make time", "fit in", "schedule"],
            "difficulty": "intermediate",
            "reel_url": url,
            "date": date,
        }

    return None


def derive_entry_with_openai(item, caption):
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None

    code = item.get("code")
    prompt = f"""You update a Korean English-learning Reel catalog.

Caption:
{caption}

If this Reel teaches a specific English expression, return only JSON:
{{
  "include": true,
  "expression_en": "main expression",
  "expression_meaning_kr": "Korean meaning, max 15 chars",
  "situation_kr": "Korean use case ending with ~할 때, max 25 chars",
  "description_kr": "Korean usage note, max 80 chars",
  "category": "one of: 인사·소개, 일상대화, 감정·리액션, 요청·부탁, 의견·토론, 사과·감사, 비즈니스, 여행·외출, 관용구·슬랭, 문화·뉘앙스, 인터뷰",
  "search_keywords_kr": ["4-6 Korean keywords"],
  "search_keywords_en": ["2-4 English keywords"],
  "difficulty": "beginner or intermediate or advanced"
}}

If it is promotional, app recommendation, subscriber intro, or not an expression lesson, return:
{{"include": false}}
"""
    data = http_json(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "User-Agent": "english-link-updater",
        },
        payload={
            "model": "gpt-4o-mini",
            "temperature": 0.1,
            "max_tokens": 500,
            "messages": [{"role": "user", "content": prompt}],
        },
    )
    text = data["choices"][0]["message"]["content"].strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    result = json.loads(text)
    if not result.get("include"):
        return None
    result.pop("include", None)
    result["reel_url"] = f"https://www.instagram.com/reel/{code}/"
    result["date"] = date_from_item(item)
    return result


def derive_entry(item):
    caption = normalize_caption((item.get("caption") or {}).get("text", ""))
    if not caption:
        return None, "empty caption"

    entry = derive_entry_from_known_caption(item, caption)
    if entry:
        return entry, None

    try:
        entry = derive_entry_with_openai(item, caption)
    except Exception as exc:
        return None, f"OpenAI parse failed: {exc}"
    if entry:
        return entry, None
    return None, "not an expression lesson"


def main():
    load_dotenv()
    entries, categories = parse_data_js(DATA_PATHS[0])
    existing_urls = {entry.get("reel_url") for entry in entries}

    feed = fetch_public_feed()
    added = []
    skipped = []

    for item in feed.get("items", []):
        if item.get("product_type") != "clips" or not item.get("code"):
            continue
        url = f"https://www.instagram.com/reel/{item['code']}/"
        if url in existing_urls:
            skipped.append((url, "already exists"))
            continue
        entry, reason = derive_entry(item)
        if not entry:
            skipped.append((url, reason))
            continue
        entries.insert(0, entry)
        existing_urls.add(url)
        added.append(url)

    entries.sort(key=lambda row: row.get("date") or "", reverse=True)
    for index, entry in enumerate(entries, start=1):
        entry["id"] = index

    write_data_js(entries, categories)

    print(f"Public Instagram items checked: {len(feed.get('items', []))}")
    print(f"Added: {len(added)}")
    for url in added:
        print(f"  + {url}")
    print(f"Skipped: {len(skipped)}")
    for url, reason in skipped:
        print(f"  - {url}: {reason}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
