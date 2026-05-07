const FORBIDDEN_PATTERNS = [
  /natural english line/i,
  /what would sound natural/i,
  /placeholder/i,
  /meta/i,
  /system instruction/i,
  /\[blank\]/i,
  /speaker a:\s*"i need/i,
  /speaker b:\s*"\[blank\]/i
];

function stripCodeFences(text) {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed.startsWith('```')) return trimmed;
  return trimmed.split('\n').slice(1).join('\n').replace(/```$/, '').trim();
}

function parseJSON(text) {
  return JSON.parse(stripCodeFences(text));
}

function hasForbiddenText(value) {
  return FORBIDDEN_PATTERNS.some(pattern => pattern.test(value || ''));
}

function isValidQuizPayload(payload, expression) {
  if (!payload || typeof payload !== 'object') return false;
  if (typeof payload.prompt !== 'string' || !payload.prompt.trim()) return false;
  if (!Array.isArray(payload.options) || payload.options.length !== 3) return false;
  if (typeof payload.explanation !== 'string' || !payload.explanation.trim()) return false;
  if (hasForbiddenText(payload.prompt) || hasForbiddenText(payload.explanation)) return false;

  let correctCount = 0;
  for (const option of payload.options) {
    if (!option || typeof option.text !== 'string' || typeof option.correct !== 'boolean') return false;
    if (!option.text.includes('____')) return false;
    if (hasForbiddenText(option.text)) return false;
    if (option.correct) correctCount += 1;
  }

  if (correctCount !== 1) return false;

  const combined = [payload.prompt, payload.explanation, ...payload.options.map(option => option.text)].join(' ');
  if (!combined.toLowerCase().includes(expression.toLowerCase()) && !payload.explanation.toLowerCase().includes(expression.toLowerCase())) {
    return false;
  }

  return true;
}

async function callOpenAI(apiKey, prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 700,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error: ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function buildGenerationPrompt(entry) {
  return `You generate a 10-second quiz for a Korean English-learning app.

Target expression:
- expression_en: "${entry.expression_en}"
- expression_meaning_kr: "${entry.expression_meaning_kr}"
- situation_kr: "${entry.situation_kr}"
- description_kr: "${entry.description_kr}"
- category: "${entry.category}"
- keywords: ${JSON.stringify([...(entry.search_keywords_kr || []), ...(entry.search_keywords_en || [])])}

Task:
- Create a multiple-choice quiz with 3 dialogue options.
- The user already sees today's expression at the top of the card.
- Your job is to test whether the user can recognize the ONE dialogue where that exact expression most naturally fits into the blank.
- Each option must be a self-contained, realistic real-world mini-dialogue.
- Every option must contain the blank token exactly as "____".
- Exactly one option must logically demand the target expression.
- The two wrong options must still sound like plausible conversations, but the target expression should feel unnatural or incorrect in those blanks.

Hard constraints:
- DO NOT output placeholder text.
- DO NOT use meta-language in the dialogue.
- DO NOT write things like "I need a natural English line here", "what would sound natural", "Speaker A", "Speaker B", "system", or "placeholder".
- DO NOT explain the task inside the dialogue.
- The conversation must be realistic and sound like native-level everyday speech.
- Keep each option concise: 2 lines max.
- Write the prompt and explanation in Korean.
- Write the dialogue itself in natural English.

Return ONLY valid JSON:
{
  "prompt": "Korean instruction for the quiz",
  "options": [
    { "text": "A: ...\\nB: ____", "correct": true },
    { "text": "A: ...\\nB: ____", "correct": false },
    { "text": "A: ...\\nB: ____", "correct": false }
  ],
  "explanation": "Korean explanation of why the correct dialogue fits the target expression"
}`;
}

function buildValidationPrompt(entry, candidate) {
  return `You validate and repair a daily English quiz for a Korean learning app.

Target expression:
- expression_en: "${entry.expression_en}"
- expression_meaning_kr: "${entry.expression_meaning_kr}"
- situation_kr: "${entry.situation_kr}"
- description_kr: "${entry.description_kr}"

Candidate JSON:
${candidate}

Validation checklist:
- The quiz must keep the same concept: choose the ONE dialogue where today's expression most naturally fits the blank.
- Every option must be a realistic, self-contained conversation.
- No placeholder bleed except the final blank token "____".
- No meta-language, no task wording, no system wording, no hallucinated template text.
- Exactly one option is correct.
- The correct option must strongly and logically demand the target expression.
- Wrong options must be plausible but incorrect for the target expression.
- Korean prompt and explanation must be clear and natural.
- Dialogue English must be natural and idiomatic.

Hard constraints:
- DO NOT output placeholder text.
- DO NOT use meta-language in the dialogue.
- The conversation must be a self-contained, realistic real-world scenario.

If the candidate is flawed, rewrite it completely.
Return ONLY valid JSON with this schema:
{
  "prompt": "Korean instruction",
  "options": [
    { "text": "A: ...\\nB: ____", "correct": true },
    { "text": "A: ...\\nB: ____", "correct": false },
    { "text": "A: ...\\nB: ____", "correct": false }
  ],
  "explanation": "Korean explanation"
}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rateLimit = globalThis._dailyQuizRateLimit || (globalThis._dailyQuizRateLimit = {});
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const now = Date.now();
  const WINDOW = 60000;
  const MAX = 10;
  if (!rateLimit[ip]) rateLimit[ip] = [];
  rateLimit[ip] = rateLimit[ip].filter(t => now - t < WINDOW);
  if (rateLimit[ip].length >= MAX) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }
  rateLimit[ip].push(now);

  const entry = req.body?.entry;
  if (!entry?.expression_en || !entry?.expression_meaning_kr || !entry?.situation_kr) {
    return res.status(400).json({ error: 'Missing entry fields' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const cacheKey = `${entry.id || entry.expression_en}:${entry.date || ''}`;
  const cache = globalThis._dailyQuizCache || (globalThis._dailyQuizCache = new Map());
  if (cache.has(cacheKey)) {
    return res.status(200).json(cache.get(cacheKey));
  }

  try {
    const generatedText = await callOpenAI(apiKey, buildGenerationPrompt(entry));
    const validatedText = await callOpenAI(apiKey, buildValidationPrompt(entry, generatedText));
    const quiz = parseJSON(validatedText);

    if (!isValidQuizPayload(quiz, entry.expression_en)) {
      throw new Error('Validated quiz failed guard checks');
    }

    const response = { quiz };
    cache.set(cacheKey, response);
    return res.status(200).json(response);
  } catch (err) {
    console.error('Daily quiz generation error:', err);
    return res.status(502).json({ error: 'Daily quiz generation failed' });
  }
}
