const fs = require('fs');
const path = require('path');

// --- Load env ---
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^(\w+)=(.+)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
}

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('ERROR: OPENAI_API_KEY not set. Export it or add to .env file.');
  process.exit(1);
}

const API_URL = 'https://api.openai.com/v1/chat/completions';
const PROGRESS_FILE = 'enriched-progress.json';
const BATCH_SIZE = 5;
const BATCH_DELAY = 1500; // ms between batches

// --- Load data.js ---
const code = fs.readFileSync('data.js', 'utf8');
const fn = new Function(code + '; return REELS_DATA;');
const REELS_DATA = fn();
console.log(`Loaded ${REELS_DATA.length} entries from data.js`);

// --- Load progress ---
let progress = {};
if (fs.existsSync(PROGRESS_FILE)) {
  progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  console.log(`Resuming: ${Object.keys(progress).length} entries already processed`);
}

const VALID_CATEGORIES = [
  '인사·소개', '일상대화', '감정·리액션', '요청·부탁', '의견·토론',
  '사과·감사', '비즈니스', '여행·외출', '관용구·슬랭', '문화·뉘앙스'
];

async function enrichEntry(entry) {
  const prompt = `You are a data processor for a Korean English-learning Instagram account (@ok.english.kr).

Given this raw Reel entry data, restructure it into clean educational content.

Raw data:
- expression_en: "${entry.expression_en}"
- situation_kr: "${entry.situation_kr}"
- description_kr: "${entry.description_kr}"
- current tags: ${JSON.stringify(entry.tags)}
- date: "${entry.date}"

Return ONLY a valid JSON object (no markdown, no backticks, no explanation) with these fields:

{
  "expression_en": "The English expression taught in this Reel (clean, canonical form — e.g. 'Can I get a...', 'It's on the tip of my tongue'). If the original is a question like '노잼을 영어로?' extract the actual English expression being taught. If you cannot determine the expression, return empty string.",
  "expression_meaning_kr": "One-line Korean translation/meaning of the expression (e.g. '~를 주세요', '혀끝에서 맴도는')",
  "situation_kr": "When to use this expression — describe the real-life situation in Korean, written as a natural phrase ending with ~할 때, ~하는 경우, ~하고 싶을 때 etc. (e.g. '카페에서 음료를 주문할 때', '말이 떠오르지 않아서 답답할 때'). Max 25 characters.",
  "description_kr": "A helpful 1-2 sentence Korean description expanding on usage, nuance, or tips. NOT a repeat of situation_kr. Should feel like a friend explaining when and how to use this expression. Max 60 characters.",
  "category": "Exactly ONE from: 인사·소개, 일상대화, 감정·리액션, 요청·부탁, 의견·토론, 사과·감사, 비즈니스, 여행·외출, 관용구·슬랭, 문화·뉘앙스",
  "search_keywords_kr": ["3-6 Korean keywords/synonyms someone might search when looking for this expression — include colloquial terms"],
  "search_keywords_en": ["2-4 English keywords/synonyms"],
  "difficulty": "beginner OR intermediate OR advanced"
}

Important:
- If the raw data is too vague to determine the English expression (e.g. just a Korean teaser like "이건 영어로 뭐라고 할까?"), try to infer from context. If truly impossible, set expression_en to "" and note the original caption in description_kr.
- search_keywords should include words a real Korean person would type when they're stuck and looking for this expression.
- Keep all Korean text natural and concise. No formal/stiff language.`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content.trim();

  // Strip markdown fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleaned);
}

async function processWithRetry(entry, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await enrichEntry(entry);

      // Validate category
      if (!VALID_CATEGORIES.includes(result.category)) {
        console.warn(`  [id=${entry.id}] Invalid category "${result.category}", defaulting to 일상대화`);
        result.category = '일상대화';
      }

      // Validate difficulty
      if (!['beginner', 'intermediate', 'advanced'].includes(result.difficulty)) {
        result.difficulty = 'intermediate';
      }

      // Ensure arrays
      if (!Array.isArray(result.search_keywords_kr)) result.search_keywords_kr = [];
      if (!Array.isArray(result.search_keywords_en)) result.search_keywords_en = [];

      return result;
    } catch (err) {
      console.warn(`  [id=${entry.id}] Attempt ${attempt}/${maxRetries} failed: ${err.message}`);
      if (attempt < maxRetries) {
        await sleep(1000 * Math.pow(2, attempt));
      } else {
        return null; // Mark for manual review
      }
    }
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
}

async function main() {
  const toProcess = REELS_DATA.filter(e => !progress[e.id]);
  console.log(`Entries to process: ${toProcess.length}`);

  const failed = [];

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toProcess.length / BATCH_SIZE);
    console.log(`\nBatch ${batchNum}/${totalBatches} (entries ${i + 1}-${Math.min(i + BATCH_SIZE, toProcess.length)})`);

    const results = await Promise.all(batch.map(async (entry) => {
      const result = await processWithRetry(entry);
      if (result) {
        progress[entry.id] = result;
        process.stdout.write(`  ✓ id=${entry.id} `);
      } else {
        failed.push(entry);
        process.stdout.write(`  ✗ id=${entry.id} `);
      }
      return result;
    }));

    console.log('');

    // Save progress every batch
    saveProgress();

    // Rate limit delay
    if (i + BATCH_SIZE < toProcess.length) {
      await sleep(BATCH_DELAY);
    }
  }

  console.log(`\n--- Processing complete ---`);
  console.log(`Processed: ${Object.keys(progress).length}`);
  console.log(`Failed: ${failed.length}`);

  // --- Generate new data.js ---
  const enriched = REELS_DATA.map(entry => {
    const e = progress[entry.id];
    if (!e) {
      // Failed entry — keep original with fallback category
      return {
        id: entry.id,
        expression_en: entry.expression_en || '',
        expression_meaning_kr: '',
        situation_kr: entry.situation_kr || '[수동 입력 필요]',
        description_kr: entry.description_kr || '',
        category: '일상대화',
        search_keywords_kr: [],
        search_keywords_en: [],
        difficulty: 'intermediate',
        reel_url: entry.reel_url,
        date: entry.date
      };
    }

    return {
      id: entry.id,
      expression_en: e.expression_en || entry.expression_en || '',
      expression_meaning_kr: e.expression_meaning_kr || '',
      situation_kr: e.situation_kr || entry.situation_kr || '',
      description_kr: e.description_kr || entry.description_kr || '',
      category: e.category,
      search_keywords_kr: e.search_keywords_kr || [],
      search_keywords_en: e.search_keywords_en || [],
      difficulty: e.difficulty || 'intermediate',
      reel_url: entry.reel_url,
      date: entry.date
    };
  });

  // Sort by date descending (empty dates last)
  enriched.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  // Generate data.js
  const entries = enriched.map(e => {
    return `  {
    id: ${e.id},
    expression_en: ${JSON.stringify(e.expression_en)},
    expression_meaning_kr: ${JSON.stringify(e.expression_meaning_kr)},
    situation_kr: ${JSON.stringify(e.situation_kr)},
    description_kr: ${JSON.stringify(e.description_kr)},
    category: ${JSON.stringify(e.category)},
    search_keywords_kr: ${JSON.stringify(e.search_keywords_kr)},
    search_keywords_en: ${JSON.stringify(e.search_keywords_en)},
    difficulty: ${JSON.stringify(e.difficulty)},
    reel_url: ${JSON.stringify(e.reel_url)},
    date: ${JSON.stringify(e.date)}
  }`;
  }).join(',\n');

  const categoriesConst = `const CATEGORIES = [
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
];`;

  const output = `const REELS_DATA = [\n${entries}\n];\n\n${categoriesConst}\n`;
  fs.writeFileSync('data.js', output, 'utf8');
  console.log(`\nWrote data.js with ${enriched.length} entries`);

  // --- Generate report ---
  const catCounts = {};
  const diffCounts = {};
  VALID_CATEGORIES.forEach(c => catCounts[c] = 0);
  ['beginner', 'intermediate', 'advanced'].forEach(d => diffCounts[d] = 0);

  for (const e of enriched) {
    catCounts[e.category] = (catCounts[e.category] || 0) + 1;
    diffCounts[e.difficulty] = (diffCounts[e.difficulty] || 0) + 1;
  }

  let report = `# Data Enrichment Report\n\n`;
  report += `## Summary\n`;
  report += `- Total entries processed: ${REELS_DATA.length}\n`;
  report += `- Successfully enriched: ${Object.keys(progress).length}\n`;
  report += `- Failed / needs manual review: ${failed.length}\n\n`;

  report += `## Category Distribution\n`;
  report += `| Category | Count | % |\n|----------|-------|---|\n`;
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    report += `| ${cat} | ${count} | ${(count / enriched.length * 100).toFixed(1)}% |\n`;
  }

  report += `\n## Difficulty Distribution\n`;
  report += `| Level | Count |\n|-------|-------|\n`;
  for (const [level, count] of Object.entries(diffCounts)) {
    report += `| ${level} | ${count} |\n`;
  }

  if (failed.length > 0) {
    report += `\n## Entries Needing Manual Review\n`;
    report += `| id | date | issue |\n|----|------|-------|\n`;
    for (const f of failed) {
      report += `| ${f.id} | ${f.date} | API call failed after 3 retries |\n`;
    }
  }

  report += `\n## Sample Enriched Entries (first 5)\n\n`;
  report += '```json\n';
  for (const e of enriched.slice(0, 5)) {
    report += JSON.stringify(e, null, 2) + '\n\n';
  }
  report += '```\n';

  fs.writeFileSync('enrichment-report.md', report, 'utf8');
  console.log('Wrote enrichment-report.md');
}

main().catch(err => {
  console.error('Fatal error:', err);
  saveProgress();
  process.exit(1);
});
