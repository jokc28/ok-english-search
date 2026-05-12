import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

let cachedCatalog = null;

function loadCatalog() {
  if (cachedCatalog) return cachedCatalog;

  const candidates = [
    path.join(process.cwd(), 'data.js'),
    path.join(process.cwd(), 'public', 'data.js'),
  ];
  const dataPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!dataPath) {
    throw new Error('Expression catalog not found');
  }

  const code = fs.readFileSync(dataPath, 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${code}\nthis.REELS_DATA = REELS_DATA;`, context);

  cachedCatalog = Array.isArray(context.REELS_DATA)
    ? context.REELS_DATA.filter(isTrustedReelEntry)
    : [];
  return cachedCatalog;
}

function isTrustedReelEntry(entry) {
  return !!(
    entry &&
    entry.source_type === 'instagram_reel' &&
    entry.target_confidence === 'verified' &&
    entry.excluded_from_daily !== true &&
    String(entry.expression_en || '').trim() &&
    String(entry.expression_meaning_kr || '').trim() &&
    String(entry.situation_kr || '').trim() &&
    /^https:\/\/www\.instagram\.com\/reel\/[A-Za-z0-9_-]+\/?$/.test(String(entry.reel_url || '').trim())
  );
}

function stableShuffle(items, seedText) {
  const arr = [...items];
  let seed = Array.from(String(seedText)).reduce(
    (acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0,
    2166136261,
  );

  for (let i = arr.length - 1; i > 0; i -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function findCatalogEntry(requestEntry, catalog) {
  const id = Number(requestEntry?.id);
  if (Number.isFinite(id)) {
    const byId = catalog.find((entry) => entry.id === id);
    if (byId) return byId;
  }

  const expression = String(requestEntry?.expression_en || '').trim().toLowerCase();
  const reelUrl = String(requestEntry?.reel_url || '').trim();
  return catalog.find((entry) =>
    entry.reel_url === reelUrl &&
    entry.expression_en.trim().toLowerCase() === expression
  );
}

function collectDistractors(entry, catalog) {
  const seen = new Set([entry.expression_en.trim().toLowerCase()]);
  const tiers = [
    catalog.filter((item) => item.id !== entry.id && item.category === entry.category && item.difficulty === entry.difficulty),
    catalog.filter((item) => item.id !== entry.id && item.category === entry.category),
    catalog.filter((item) => item.id !== entry.id && item.difficulty === entry.difficulty),
    catalog.filter((item) => item.id !== entry.id),
  ];
  const distractors = [];

  for (const tier of tiers) {
    for (const item of stableShuffle(tier, `${entry.id}:${tier.length}:${distractors.length}`)) {
      const expression = item.expression_en.trim();
      const key = expression.toLowerCase();
      if (!expression || seen.has(key)) continue;
      seen.add(key);
      distractors.push(item);
      if (distractors.length >= 3) return distractors;
    }
  }

  return distractors;
}

function buildExpressionChoiceQuiz(entry, catalog) {
  const distractors = collectDistractors(entry, catalog);
  const options = stableShuffle(
    [
      { text: entry.expression_en, correct: true },
      ...distractors.map((item) => ({ text: item.expression_en, correct: false })),
    ],
    `daily:${entry.id}:${entry.date || ''}`,
  );

  return {
    prompt: `다음 뜻과 상황에 가장 자연스러운 영어 표현을 고르세요.`,
    displayCue: `${entry.expression_meaning_kr} · ${entry.situation_kr}`,
    options,
    explanation: `"${entry.expression_en}"는 "${entry.situation_kr}"에 쓰는 표현입니다.`,
    source: {
      id: entry.id,
      reel_url: entry.reel_url,
    },
  };
}

function buildDailyUsageQuiz(entry, catalog) {
  const distractors = collectDistractors(entry, catalog);
  const options = stableShuffle(
    [
      {
        text: `${entry.situation_kr}\n${entry.expression_meaning_kr}`,
        correct: true,
      },
      ...distractors.map((item) => ({
        text: `${item.situation_kr}\n${item.expression_meaning_kr}`,
        correct: false,
      })),
    ],
    `daily-usage:${entry.id}:${entry.date || ''}`,
  );

  return {
    prompt: '오늘 표현을 실제로 쓸 수 있는 상황을 고르세요.',
    options,
    explanation: `"${entry.expression_en}"는 "${entry.situation_kr}"에 쓰는 표현입니다.`,
    source: {
      id: entry.id,
      reel_url: entry.reel_url,
    },
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const catalog = loadCatalog();
    const entry = findCatalogEntry(req.body?.entry, catalog);

    if (!entry) {
      return res.status(400).json({
        error: 'Entry is not in the verified Instagram Reel catalog',
      });
    }

    const quiz = req.body?.variant === 'daily_usage'
      ? buildDailyUsageQuiz(entry, catalog)
      : buildExpressionChoiceQuiz(entry, catalog);

    return res.status(200).json({ quiz });
  } catch (err) {
    console.error('Daily quiz generation failed:', err);
    return res.status(500).json({ error: 'Daily quiz generation failed' });
  }
}
