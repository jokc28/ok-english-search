const fs = require('fs');
const vm = require('vm');

const VALID_CATEGORIES = [
  '인사·소개', '일상대화', '감정·리액션', '요청·부탁', '의견·토론',
  '사과·감사', '비즈니스', '여행·외출', '관용구·슬랭', '문화·뉘앙스'
];

const MANUAL_CORRECTIONS = {
  'https://www.instagram.com/reel/DITaUF-tmZ_/': {
    expression_en: 'Is my voice coming through okay?',
    expression_meaning_kr: '제 목소리 잘 들리나요?',
    situation_kr: '화상회의에서 소리 확인할 때',
    description_kr: '"Can you hear me?"보다 부드럽게 내 음성이 잘 전달되는지 확인할 때 쓰는 표현이에요.',
    category: '비즈니스',
    search_keywords_kr: ['화상회의', '소리 확인', '줌', '회의 영어', '잘 들리나요'],
    search_keywords_en: ['video call', 'audio check', 'coming through', 'voice'],
    difficulty: 'intermediate',
    target_confidence: 'verified',
    context_confidence: 'verified',
    target_audit_note: 'Manual transcript audit: the Reel frames "can you hear me" as the common phrase and teaches the softer "coming through" alternative.',
    context_audit_note: 'Manual transcript audit: the transcript discusses Zoom/meeting audio and whether the voice is coming through.',
    quiz_sentence_en: 'Before we start, is my voice coming through okay?',
    quiz_sentence_confidence: 'verified',
    usage_context_kr: '화상회의에서 내 목소리가 잘 전달되는지 부드럽게 확인할 때',
    rejected_phrases: ['can you hear me']
  },
  'https://www.instagram.com/reel/DHalR-Bz1Ci/': {
    expression_en: 'pretty',
    expression_meaning_kr: '꽤, 상당히',
    situation_kr: '정도를 강조하거나 거의 확신할 때',
    description_kr: 'pretty는 예쁘다는 뜻뿐 아니라 꽤/상당히, 거의 확신한다는 뉘앙스로도 써요.',
    category: '문화·뉘앙스',
    search_keywords_kr: ['꽤', '상당히', '거의 확신', 'pretty 뜻', '정도 강조'],
    search_keywords_en: ['pretty', 'quite', 'fairly', 'pretty sure'],
    difficulty: 'beginner',
    target_confidence: 'verified',
    context_confidence: 'verified',
    target_audit_note: 'Manual transcript audit: the Reel teaches pretty as "quite/fairly" and "pretty sure", not a greeting/check-in phrase.',
    context_audit_note: 'Manual transcript audit: corrected the prior wrong context "상대방의 안부를 물을 때".',
    target_evidence: "pretty can mean quite/fairly; transcript example: I'm pretty sure he's coming.",
    quiz_sentence_en: "I'm pretty sure he's coming.",
    quiz_sentence_confidence: 'verified',
    usage_context_kr: '어떤 정도가 꽤 높거나 거의 확신한다고 말할 때',
    rejected_phrases: ['fine']
  }
};

const GENERIC_CONTEXT_WORDS = new Set([
  '때', '경우', '상황', '표현', '사용', '쓰는', '쓸', '할', '하는', '하고',
  '하고싶을', '싶을', '말할', '말하고', '영어', '자연스럽게', '유용해요',
  '상대방', '누군가', '사람', '일상', '친구', '자주'
]);

function loadReelsData(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${code}\nthis.REELS_DATA = REELS_DATA;`, context);
  return context.REELS_DATA;
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9가-힣\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeEnglish(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expressionParts(expression) {
  return String(expression || '')
    .split(/\s+(?:vs\.?|versus)\s+|(?:\s*)[／/](?:\s*)/i)
    .map(part => part.trim())
    .filter(Boolean);
}

function transcriptSnippet(transcript, expression) {
  if (!transcript || !expression) return '';
  const haystack = normalize(transcript);
  const needle = normalize(expression);
  const index = haystack.indexOf(needle);
  if (index < 0) return '';
  return haystack.slice(Math.max(0, index - 80), index + needle.length + 160).trim();
}

function hasCorrectionMarkerAfterExpression(transcript, expression) {
  if (!transcript || !expression) return false;
  const haystack = normalize(transcript);
  const needle = normalize(expression);
  const index = haystack.indexOf(needle);
  if (index < 0) return false;
  const after = haystack.slice(index, index + 220);
  return /(많이\s*하는데\s*그것보다는|그것보다는|보다는\s*무슨|대신\s*|instead of|rather than)/i.test(after);
}

function expressionAppearsInSource(entry, rawEntry, transcript) {
  const expression = normalize(entry.expression_en);
  if (!expression) return false;

  const sourceText = normalize([
    transcript,
    rawEntry?.expression_en,
    rawEntry?.expression_meaning_kr,
    rawEntry?.situation_kr,
    rawEntry?.description_kr
  ].filter(Boolean).join(' '));

  if (sourceText.includes(expression)) return true;

  const parts = expressionParts(entry.expression_en).map(normalize);
  return parts.length > 1 && parts.every(part => sourceText.includes(part));
}

function koreanTokens(value) {
  return String(value || '')
    .match(/[가-힣]{2,}/g)?.map(token => token.trim())
    .filter(token => token && !GENERIC_CONTEXT_WORDS.has(token)) || [];
}

function contextAppearsInTranscript(entry, transcript) {
  const haystack = normalize(transcript);
  if (!haystack) return false;

  const situationTokens = [...new Set(koreanTokens(entry.situation_kr))];
  if (!situationTokens.length) return false;

  const matches = situationTokens.filter(token => haystack.includes(normalize(token)));
  if (matches.length > 0) return true;

  const evidence = normalize(entry.target_evidence || '');
  return situationTokens.some(token => evidence.includes(normalize(token)));
}

function cleanEnglishSpan(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .replace(/^[-–—:,.\s]+|[-–—:,\s]+$/g, '')
    .trim();
}

function englishCandidateSpans(transcript) {
  const spans = String(transcript || '').match(/[A-Za-z][A-Za-z0-9'"’.,!?;:() -]{4,}/g) || [];
  return spans.flatMap(span => {
    const cleaned = cleanEnglishSpan(span);
    const sentences = cleaned.split(/(?<=[.!?])\s+/).map(cleanEnglishSpan).filter(Boolean);
    return [cleaned, ...sentences];
  })
    .filter(span => /[A-Za-z]/.test(span))
    .filter(span => span.length <= 180);
}

function containsExpression(example, expression) {
  const normalizedExample = normalizeEnglish(example);
  const parts = expressionParts(expression).map(normalizeEnglish).filter(Boolean);
  if (!parts.length) return false;
  return parts.some(part => normalizedExample.includes(part));
}

function isMeaningfulQuizSentence(entry, example) {
  const cleaned = cleanEnglishSpan(example);
  if (!cleaned || /[가-힣]/.test(cleaned)) return false;
  if (!containsExpression(cleaned, entry.expression_en)) return false;
  if (!/[.!?]$/.test(cleaned)) return false;

  const normalizedExample = normalizeEnglish(cleaned);
  const normalizedExpression = normalizeEnglish(entry.expression_en);
  const exampleWords = normalizedExample.split(/\s+/).filter(Boolean);
  const expressionWords = normalizedExpression.split(/\s+/).filter(Boolean);

  if (normalizedExample === normalizedExpression) return false;
  if (exampleWords.length < Math.max(4, expressionWords.length + 2)) return false;
  if (expressionWords.length <= 2 && normalizedExample.endsWith(normalizedExpression)) return false;
  if (/natural place to use|sounds less natural|what would sound natural|how would you describe|phrase would fit/i.test(cleaned)) return false;
  if (/^(?:[a-z]+[,.]\s*){2,}[a-z]+[.!?]?$/i.test(cleaned)) return false;

  return true;
}

function compactQuizSentence(entry, example) {
  const expression = normalizeEnglish(entry.expression_en);
  const expressionWords = expression.split(/\s+/).filter(Boolean).length;
  const seen = new Set();
  const sentences = cleanEnglishSpan(example)
    .split(/(?<=[.!?])\s+/)
    .map(cleanEnglishSpan)
    .filter(Boolean)
    .filter(sentence => {
      const normalized = normalizeEnglish(sentence);
      const wordCount = normalized.split(/\s+/).filter(Boolean).length;
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      if (normalized === expression) return false;
      if (expressionWords <= 3 && normalized.endsWith(expression) && wordCount <= expressionWords + 1) return false;
      return true;
    });

  return sentences.join(' ').trim();
}

function extractQuizSentence(entry, transcript) {
  const existing = compactQuizSentence(entry, entry.quiz_sentence_en);
  if (isMeaningfulQuizSentence(entry, existing)) return existing;

  const candidates = englishCandidateSpans(transcript)
    .map(span => compactQuizSentence(entry, span))
    .filter(span => isMeaningfulQuizSentence(entry, span))
    .sort((a, b) => {
      const aWords = normalizeEnglish(a).split(/\s+/).length;
      const bWords = normalizeEnglish(b).split(/\s+/).length;
      return aWords - bWords;
    });

  return candidates[0] || '';
}

function buildValidation(entry, rawEntry, transcript, enrichedEntry) {
  const correction = MANUAL_CORRECTIONS[entry.reel_url];
  if (correction) {
    const quizSentenceVerified = isMeaningfulQuizSentence(correction, correction.quiz_sentence_en);
    return {
      ...entry,
      ...correction,
      source_type: 'instagram_reel',
      source_reel_id: rawEntry?.id || null,
      target_source: 'transcript_manual_audit',
      quiz_sentence_confidence: quizSentenceVerified ? 'verified' : 'review',
      quiz_sentence_audit_note: quizSentenceVerified ? 'Manual quiz sentence passed sentence-quality checks.' : 'Manual quiz sentence is missing or too weak.',
      excluded_from_daily: !quizSentenceVerified
    };
  }

  const hasTranscript = Boolean(String(transcript || '').trim());
  const confidence = enrichedEntry?.confidence || (hasTranscript ? 'review' : 'low');
  const appears = expressionAppearsInSource(entry, rawEntry, transcript);
  const correctionMarker = hasCorrectionMarkerAfterExpression(transcript, entry.expression_en);
  const targetVerified = confidence === 'high' && appears && !correctionMarker;
  const contextVerified = targetVerified && contextAppearsInTranscript(entry, transcript);
  const quizSentence = extractQuizSentence(entry, transcript);
  const quizSentenceVerified = targetVerified && contextVerified && isMeaningfulQuizSentence(entry, quizSentence);

  return {
    ...entry,
    category: VALID_CATEGORIES.includes(entry.category) ? entry.category : '일상대화',
    source_type: 'instagram_reel',
    source_reel_id: rawEntry?.id || null,
    target_source: hasTranscript ? 'transcript' : 'caption',
    target_confidence: targetVerified ? 'verified' : 'review',
    context_confidence: contextVerified ? 'verified' : 'review',
    target_audit_note: targetVerified
      ? 'Transcript/caption audit passed.'
      : [
        confidence !== 'high' ? `Extractor confidence is ${confidence}.` : '',
        !appears ? 'Expression was not directly found in transcript/caption text.' : '',
        correctionMarker ? 'Transcript appears to contrast this phrase with a better alternative.' : ''
      ].filter(Boolean).join(' '),
    context_audit_note: contextVerified
      ? 'Usage context is supported by transcript terms.'
      : 'Usage context was not sufficiently supported by transcript terms.',
    target_evidence: transcriptSnippet(transcript, entry.expression_en),
    rejected_phrases: [],
    quiz_sentence_en: quizSentence,
    quiz_sentence_confidence: quizSentenceVerified ? 'verified' : 'review',
    quiz_sentence_audit_note: quizSentenceVerified
      ? 'Quiz sentence is a transcript-supported sentence.'
      : 'Quiz sentence is missing, too short, or only repeats the target expression.',
    usage_context_kr: entry.usage_context_kr || entry.situation_kr,
    excluded_from_daily: !(targetVerified && contextVerified && quizSentenceVerified)
  };
}

function categoriesConst() {
  return `const CATEGORIES = [
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
}

function writeData(filePath, entries) {
  fs.writeFileSync(
    filePath,
    `const REELS_DATA = ${JSON.stringify(entries, null, 2)};\n${categoriesConst()}\n`,
    'utf8'
  );
}

function writeReport(entries) {
  const review = entries.filter(entry =>
    entry.target_confidence !== 'verified' ||
    entry.context_confidence !== 'verified' ||
    entry.quiz_sentence_confidence !== 'verified'
  );
  const corrected = entries.filter(entry => MANUAL_CORRECTIONS[entry.reel_url]);
  let report = '# Target Expression Audit\n\n';
  report += '## Summary\n';
  report += `- Total catalog entries: ${entries.length}\n`;
  report += `- Verified for Expression of the Day / quiz: ${entries.length - review.length}\n`;
  report += `- Excluded pending review: ${review.length}\n`;
  report += `- Manual corrections applied: ${corrected.length}\n\n`;

  report += '## Manual Corrections\n';
  report += '| id | source_reel_id | expression_en | usage_context_kr | quiz_sentence_en | rejected_phrases | reel_url |\n';
  report += '|----|----------------|---------------|------------------|------------------|------------------|----------|\n';
  for (const entry of corrected) {
    report += `| ${entry.id} | ${entry.source_reel_id || ''} | ${entry.expression_en} | ${entry.usage_context_kr || entry.situation_kr || ''} | ${entry.quiz_sentence_en || ''} | ${(entry.rejected_phrases || []).join(', ')} | ${entry.reel_url} |\n`;
  }

  report += '\n## Excluded Pending Review\n';
  report += '| id | source_reel_id | expression_en | target_confidence | context_confidence | quiz_sentence_confidence | reason | reel_url |\n';
  report += '|----|----------------|---------------|-------------------|--------------------|--------------------|--------|----------|\n';
  for (const entry of review) {
    report += `| ${entry.id} | ${entry.source_reel_id || ''} | ${entry.expression_en} | ${entry.target_confidence || ''} | ${entry.context_confidence || ''} | ${entry.quiz_sentence_confidence || ''} | ${[entry.target_audit_note, entry.context_audit_note, entry.quiz_sentence_audit_note].filter(Boolean).join(' ')} | ${entry.reel_url} |\n`;
  }

  fs.writeFileSync('target-expression-audit.md', report, 'utf8');
}

const entries = loadReelsData('data.js');
const rawEntries = JSON.parse(fs.readFileSync('reels-data.json', 'utf8'));
const transcripts = JSON.parse(fs.readFileSync('transcribe-progress.json', 'utf8'));
const enriched = JSON.parse(fs.readFileSync('enrich-transcript-progress.json', 'utf8'));
const rawByUrl = new Map(rawEntries.map(entry => [entry.reel_url, entry]));

const audited = entries.map(entry => {
  const rawEntry = rawByUrl.get(entry.reel_url);
  const sourceId = rawEntry?.id ? String(rawEntry.id) : '';
  return buildValidation(entry, rawEntry, transcripts[sourceId], enriched[sourceId]);
});

writeData('data.js', audited);
writeData('public/data.js', audited);
writeReport(audited);

const verified = audited.filter(entry =>
  entry.target_confidence === 'verified' &&
  entry.context_confidence === 'verified' &&
  entry.quiz_sentence_confidence === 'verified'
).length;
const review = audited.length - verified;
console.log(JSON.stringify({
  total: audited.length,
  verified,
  review,
  manualCorrections: Object.keys(MANUAL_CORRECTIONS).length
}, null, 2));
