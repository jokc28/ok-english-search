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
    target_audit_note: 'Manual transcript audit: the Reel frames "can you hear me" as the common phrase and teaches the softer "coming through" alternative.',
    rejected_phrases: ['can you hear me']
  }
};

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

  const parts = String(entry.expression_en || '')
    .split(/\s+(?:vs\.?|versus)\s+|(?:\s*)[／/](?:\s*)/i)
    .map(normalize)
    .filter(Boolean);
  return parts.length > 1 && parts.every(part => sourceText.includes(part));
}

function buildValidation(entry, rawEntry, transcript, enrichedEntry) {
  const correction = MANUAL_CORRECTIONS[entry.reel_url];
  if (correction) {
    return {
      ...entry,
      ...correction,
      source_type: 'instagram_reel',
      source_reel_id: rawEntry?.id || null,
      target_source: 'transcript_manual_audit',
      excluded_from_daily: false
    };
  }

  const hasTranscript = Boolean(String(transcript || '').trim());
  const confidence = enrichedEntry?.confidence || (hasTranscript ? 'review' : 'low');
  const appears = expressionAppearsInSource(entry, rawEntry, transcript);
  const correctionMarker = hasCorrectionMarkerAfterExpression(transcript, entry.expression_en);
  const verified = confidence === 'high' && appears && !correctionMarker;

  return {
    ...entry,
    category: VALID_CATEGORIES.includes(entry.category) ? entry.category : '일상대화',
    source_type: 'instagram_reel',
    source_reel_id: rawEntry?.id || null,
    target_source: hasTranscript ? 'transcript' : 'caption',
    target_confidence: verified ? 'verified' : 'review',
    target_audit_note: verified
      ? 'Transcript/caption audit passed.'
      : [
        confidence !== 'high' ? `Extractor confidence is ${confidence}.` : '',
        !appears ? 'Expression was not directly found in transcript/caption text.' : '',
        correctionMarker ? 'Transcript appears to contrast this phrase with a better alternative.' : ''
      ].filter(Boolean).join(' '),
    target_evidence: transcriptSnippet(transcript, entry.expression_en),
    rejected_phrases: [],
    excluded_from_daily: !verified
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
  const review = entries.filter(entry => entry.target_confidence !== 'verified');
  const corrected = entries.filter(entry => MANUAL_CORRECTIONS[entry.reel_url]);
  let report = '# Target Expression Audit\n\n';
  report += '## Summary\n';
  report += `- Total catalog entries: ${entries.length}\n`;
  report += `- Verified for Expression of the Day / quiz: ${entries.length - review.length}\n`;
  report += `- Excluded pending review: ${review.length}\n`;
  report += `- Manual corrections applied: ${corrected.length}\n\n`;

  report += '## Manual Corrections\n';
  report += '| id | source_reel_id | expression_en | rejected_phrases | reel_url |\n';
  report += '|----|----------------|---------------|------------------|----------|\n';
  for (const entry of corrected) {
    report += `| ${entry.id} | ${entry.source_reel_id || ''} | ${entry.expression_en} | ${(entry.rejected_phrases || []).join(', ')} | ${entry.reel_url} |\n`;
  }

  report += '\n## Excluded Pending Review\n';
  report += '| id | source_reel_id | expression_en | reason | reel_url |\n';
  report += '|----|----------------|---------------|--------|----------|\n';
  for (const entry of review) {
    report += `| ${entry.id} | ${entry.source_reel_id || ''} | ${entry.expression_en} | ${entry.target_audit_note || ''} | ${entry.reel_url} |\n`;
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

const verified = audited.filter(entry => entry.target_confidence === 'verified').length;
const review = audited.length - verified;
console.log(JSON.stringify({
  total: audited.length,
  verified,
  review,
  manualCorrections: Object.keys(MANUAL_CORRECTIONS).length
}, null, 2));
