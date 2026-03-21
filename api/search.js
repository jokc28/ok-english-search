export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting (simple in-memory, resets on cold start)
  const rateLimit = globalThis._rateLimit || (globalThis._rateLimit = {});
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

  const { query, entries } = req.body;

  if (!query || !entries) {
    return res.status(400).json({ error: 'Missing query or entries' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        temperature: 0,
        messages: [{
          role: 'user',
          content: `You are a search engine for a Korean English-learning Reel catalog (@ok.english.kr). A Korean user is looking for an English expression.

User's search query: "${query}"

Available entries (id, English expression, Korean situation, keywords):
${JSON.stringify(entries)}

Return ONLY a JSON array of entry IDs ranked by relevance (most relevant first). Max 20 results. If nothing matches, return [].

Consider:
- User might describe a situation: "회의에서 반대하고 싶을 때 뭐라고 하지?"
- User might search for expression: "rain check"
- User might describe a feeling: "정중하게 거절하는 표현"
- User might use slang or colloquial Korean

Return ONLY the array, no explanation: [5, 12, 3]`
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI API error:', errText);
      return res.status(502).json({ error: 'LLM API error' });
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    const ids = JSON.parse(text);
    return res.status(200).json({ results: ids });
  } catch (err) {
    console.error('LLM search error:', err);
    return res.status(500).json({ error: 'Search failed' });
  }
}
