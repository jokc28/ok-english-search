export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limiting (in-memory, resets on cold start)
  const rateLimit = global._rateLimit || (global._rateLimit = {});
  const WINDOW = 60000;
  const MAX_REQUESTS = 10;
  const ip = req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  if (!rateLimit[ip]) rateLimit[ip] = [];
  rateLimit[ip] = rateLimit[ip].filter(t => now - t < WINDOW);
  if (rateLimit[ip].length >= MAX_REQUESTS) {
    return res.status(429).json({ error: "Too many requests" });
  }
  rateLimit[ip].push(now);

  const { query, entries } = req.body;
  if (!query || !entries) {
    return res.status(400).json({ error: "Missing query or entries" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 300,
        temperature: 0.1,
        messages: [{
          role: "user",
          content: `You are a search engine for a Korean English-learning Reel catalog. A user is searching for an English expression they need.

User's query: "${query}"

Here are all available Reel entries (id, expression, situation, keywords):
${JSON.stringify(entries)}

Return ONLY a JSON array of entry IDs ranked by relevance to the user's query (most relevant first). Maximum 20 results. If nothing is relevant, return an empty array.

Consider:
- The user might describe a situation in Korean ("회의에서 반대하고 싶을 때 뭐라고 하지?")
- The user might search for a specific expression ("rain check")
- The user might describe a feeling or need ("정중하게 거절하는 표현")
- Match against expression, situation, and keywords

Return format: [5, 12, 3, 87, ...] (just the IDs, nothing else)`
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return res.status(502).json({ error: "LLM API error" });
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    const ids = JSON.parse(text);

    return res.status(200).json({ results: ids });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
