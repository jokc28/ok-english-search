import json

with open('reels-data.json', 'r', encoding='utf-8') as f:
    entries = json.load(f)

with open('enrich-transcript-progress.json', 'r', encoding='utf-8') as f:
    enriched = json.load(f)

VALID_CATEGORIES = [
    "인사·소개", "일상대화", "감정·리액션", "요청·부탁", "의견·토론",
    "사과·감사", "비즈니스", "여행·외출", "관용구·슬랭", "문화·뉘앙스"
]

result = []
low_confidence = []

for entry in entries:
    eid = str(entry['id'])
    e = enriched.get(eid, {})

    new_entry = {
        'id': entry['id'],
        'expression_en': e.get('expression_en', '') or entry.get('expression_en', ''),
        'expression_meaning_kr': e.get('expression_meaning_kr', ''),
        'situation_kr': e.get('situation_kr', '') or entry.get('situation_kr', ''),
        'description_kr': e.get('description_kr', '') or entry.get('description_kr', ''),
        'category': e.get('category', '일상대화'),
        'search_keywords_kr': e.get('search_keywords_kr', []),
        'search_keywords_en': e.get('search_keywords_en', []),
        'difficulty': e.get('difficulty', 'intermediate'),
        'reel_url': entry.get('reel_url', ''),
        'date': entry.get('date', '')
    }

    if new_entry['category'] not in VALID_CATEGORIES:
        new_entry['category'] = '일상대화'

    if e.get('confidence') == 'low' or not new_entry['expression_en']:
        low_confidence.append(new_entry)

    result.append(new_entry)

# Sort by date descending (empty dates last)
result.sort(key=lambda x: x['date'] if x['date'] else '', reverse=True)

# Reassign IDs
for i, entry in enumerate(result):
    entry['id'] = i + 1

categories_js = """
const CATEGORIES = [
  { id: "인사·소개", emoji: "👋", label: "인사·소개" },
  { id: "일상대화", emoji: "💬", label: "일상대화" },
  { id: "감정·리액션", emoji: "😊", label: "감정·리액션" },
  { id: "요청·부탁", emoji: "🙏", label: "요청·부탁" },
  { id: "의견·토론", emoji: "💡", label: "의견·토론" },
  { id: "사과·감사", emoji: "🙇", label: "사과·감사" },
  { id: "비즈니스", emoji: "💼", label: "비즈니스" },
  { id: "여행·외출", emoji: "✈️", label: "여행·외출" },
  { id: "관용구·슬랭", emoji: "🗣️", label: "관용구·슬랭" },
  { id: "문화·뉘앙스", emoji: "🌏", label: "문화·뉘앙스" }
];"""

with open('public/data.js', 'w', encoding='utf-8') as f:
    f.write('const REELS_DATA = ')
    json.dump(result, f, ensure_ascii=False, indent=2)
    f.write(';\n')
    f.write(categories_js)
    f.write('\n')

# Report
cat_counts = {}
diff_counts = {}
for e in result:
    cat_counts[e['category']] = cat_counts.get(e['category'], 0) + 1
    diff_counts[e['difficulty']] = diff_counts.get(e['difficulty'], 0) + 1

high_conf = sum(1 for e in enriched.values() if e.get('confidence') == 'high')
low_conf = sum(1 for e in enriched.values() if e.get('confidence') == 'low')
no_expr = sum(1 for e in result if not e['expression_en'])

report = f"""# Transcript-Based Enrichment Report

## Summary
- Total entries: {len(result)}
- High confidence (from transcript): {high_conf}
- Low confidence (caption only/unclear): {low_conf}
- No expression extracted: {no_expr}

## Category Distribution
| Category | Count | % |
|----------|-------|---|
"""
for cat in VALID_CATEGORIES:
    c = cat_counts.get(cat, 0)
    report += f"| {cat} | {c} | {c*100/len(result):.1f}% |\n"

report += f"""
## Difficulty Distribution
| Level | Count |
|-------|-------|
| beginner | {diff_counts.get('beginner', 0)} |
| intermediate | {diff_counts.get('intermediate', 0)} |
| advanced | {diff_counts.get('advanced', 0)} |

## Low Confidence Entries ({len(low_confidence)} need manual review)
| id | date | expression_en | situation_kr |
|----|------|---------------|--------------|
"""
for e in low_confidence:
    report += f"| {e['id']} | {e['date']} | {e['expression_en'] or '(empty)'} | {e['situation_kr']} |\n"

with open('enrichment-report.md', 'w', encoding='utf-8') as f:
    f.write(report)

print(f"Generated data.js: {len(result)} entries")
print(f"High confidence: {high_conf}, Low: {low_conf}, No expression: {no_expr}")
print(f"Low confidence entries: {len(low_confidence)}")
