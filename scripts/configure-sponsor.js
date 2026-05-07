const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'sponsor.config.json');
const PUBLIC_INDEX_PATH = path.join(ROOT, 'public', 'index.html');
const ROOT_INDEX_PATH = path.join(ROOT, 'index.html');

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeJS(value) {
  return JSON.stringify(String(value)).slice(1, -1);
}

function validateConfig(config) {
  const required = ['alias', 'url', 'headerLabel', 'footerLabel', 'bannerTitle', 'bannerBody', 'bannerCta'];
  const missing = required.filter(key => !config[key] || typeof config[key] !== 'string');
  if (missing.length) {
    throw new Error(`Missing sponsor config fields: ${missing.join(', ')}`);
  }

  const url = new URL(config.url);
  if (url.protocol !== 'https:') {
    throw new Error('Sponsor URL must use https.');
  }

  if (/buymeacoffee\.com/i.test(url.hostname)) {
    throw new Error('Buy Me a Coffee is disabled for this Korea-based setup. Use Patreon Shop or another supported platform.');
  }

  if (/YOUR_|example\.com|PLACEHOLDER/i.test(config.url)) {
    throw new Error('Sponsor URL still contains a placeholder.');
  }
}

function replaceOne(source, pattern, replacement, label) {
  if (!pattern.test(source)) {
    throw new Error(`Could not update ${label}.`);
  }
  return source.replace(pattern, replacement);
}

function updateIndexHTML(html, config) {
  const safeUrl = escapeHTML(config.url);
  const safeAlias = escapeJS(config.alias);
  const safeHeaderLabel = escapeHTML(config.headerLabel);
  const safeFooterLabel = escapeHTML(config.footerLabel);
  const safeBannerTitle = escapeJS(config.bannerTitle);
  const safeBannerBody = escapeJS(config.bannerBody);
  const safeBannerCta = escapeHTML(config.bannerCta);

  html = replaceOne(
    html,
    /(<a class="sponsor-link" id="headerSponsorLink" href=")[^"]+(" target="_blank" rel="noopener noreferrer" aria-label=")[^"]+(">)/,
    `$1${safeUrl}$2${escapeHTML(config.footerLabel)}$3`,
    'header sponsor link'
  );

  html = replaceOne(
    html,
    /(<a class="sponsor-link" id="headerSponsorLink"[\s\S]*?<span>)[\s\S]*?(<\/span>)/,
    `$1${safeHeaderLabel}$2`,
    'header sponsor label'
  );

  html = replaceOne(
    html,
    /(<a class="footer-sponsor" id="footerSponsorLink" href=")[^"]+(" target="_blank" rel="noopener noreferrer">)[\s\S]*?(<\/a>)/,
    `$1${safeUrl}$2${safeFooterLabel}$3`,
    'footer sponsor link'
  );

  html = replaceOne(
    html,
    /const SPONSOR_ALIAS = '[^']*';/,
    `const SPONSOR_ALIAS = '${safeAlias}';`,
    'SPONSOR_ALIAS'
  );

  html = replaceOne(
    html,
    /const SPONSOR_URL = '[^']*';/,
    `const SPONSOR_URL = '${escapeJS(config.url)}';`,
    'SPONSOR_URL'
  );

  html = replaceOne(
    html,
    /(<div class="cta-banner sponsor-banner">\s*)<h3>[\s\S]*?<\/h3>/,
    `$1<h3>${safeBannerTitle}</h3>`,
    'inline sponsor title'
  );

  html = replaceOne(
    html,
    /(<div class="cta-banner sponsor-banner">[\s\S]*?<h3>[\s\S]*?<\/h3>\s*)<p>[\s\S]*?<\/p>/,
    `$1<p>${safeBannerBody}</p>`,
    'inline sponsor body'
  );

  html = replaceOne(
    html,
    /(<a href="\$\{escapeHtml\(SPONSOR_URL\)\}" target="_blank" rel="noopener noreferrer" class="cta-button" onclick="handleSponsorClick\(event, 'inline_banner'\)">)[\s\S]*?(<\/a>)/,
    `$1${safeBannerCta}$2`,
    'inline sponsor CTA'
  );

  html = replaceOne(
    html,
    /link\.setAttribute\('aria-label', `\$\{SPONSOR_ALIAS\} [^`]+`\);/,
    "link.setAttribute('aria-label', `${SPONSOR_ALIAS} 1회 후원하기`);",
    'runtime aria label'
  );

  html = replaceOne(
    html,
    /if \(headerSponsorLink\) headerSponsorLink\.querySelector\('span'\)\.textContent = [^;]+;/,
    `if (headerSponsorLink) headerSponsorLink.querySelector('span').textContent = '${escapeJS(config.headerLabel)}';`,
    'runtime header label'
  );

  html = replaceOne(
    html,
    /if \(footerSponsorLink\) footerSponsorLink\.textContent = [^;]+;/,
    `if (footerSponsorLink) footerSponsorLink.textContent = '${escapeJS(config.footerLabel)}';`,
    'runtime footer label'
  );

  return html;
}

function main() {
  const config = readJSON(CONFIG_PATH);
  validateConfig(config);

  const publicHtml = fs.readFileSync(PUBLIC_INDEX_PATH, 'utf8');
  const updated = updateIndexHTML(publicHtml, config);
  fs.writeFileSync(PUBLIC_INDEX_PATH, updated);
  fs.writeFileSync(ROOT_INDEX_PATH, updated);

  console.log(`Sponsor configured for ${config.alias}: ${config.url}`);
}

main();
