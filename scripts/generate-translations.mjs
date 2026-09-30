/**
 * Generates all non-English locale JSON files by calling Google Cloud Translation API v3.
 *
 * Usage:
 *   GOOGLE_CLOUD_PROJECT=your-project-id node scripts/generate-translations.mjs
 *
 * Prerequisites:
 *   npm install @google-cloud/translate
 *   gcloud auth application-default login   (or set GOOGLE_APPLICATION_CREDENTIALS)
 *
 * Idempotent: skips files that already have the correct number of keys.
 * Run again after adding keys to public/locales/en/translation.json.
 */

import { TranslationServiceClient } from '@google-cloud/translate';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LOCALES_DIR = join(ROOT, 'public', 'locales');
const EN_FILE = join(LOCALES_DIR, 'en', 'translation.json');

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
if (!PROJECT) {
  console.error('ERROR: Set GOOGLE_CLOUD_PROJECT environment variable.');
  process.exit(1);
}

const LOCATION = 'global';
const client = new TranslationServiceClient();

// BCP-47 code → display name (used only for logging)
const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'cs', name: 'Czech' },
  { code: 'sk', name: 'Slovak' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ru', name: 'Russian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'da', name: 'Danish' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ga', name: 'Irish' },
  { code: 'cy', name: 'Welsh' },
  { code: 'eu', name: 'Basque' },
  { code: 'ca', name: 'Catalan' },
  { code: 'gl', name: 'Galician' },
  { code: 'el', name: 'Greek' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ar', name: 'Arabic' },
  { code: 'he', name: 'Hebrew' },
  { code: 'fa', name: 'Persian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'si', name: 'Sinhala' },
  { code: 'ne', name: 'Nepali' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'tl', name: 'Filipino' },
  { code: 'km', name: 'Khmer' },
  { code: 'my', name: 'Burmese' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'sw', name: 'Swahili' },
  { code: 'am', name: 'Amharic' },
  { code: 'so', name: 'Somali' },
];

// Flatten a nested object to {dotted.key: "value"} pairs, preserving interpolation vars
function flatten(obj, prefix = '') {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null) {
      Object.assign(result, flatten(v, key));
    } else {
      result[key] = v;
    }
  }
  return result;
}

// Unflatten dotted keys back to nested object
function unflatten(flat) {
  const result = {};
  for (const [dotKey, val] of Object.entries(flat)) {
    const parts = dotKey.split('.');
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }
  return result;
}

// Extract {{var}} placeholders so they survive translation
const PLACEHOLDER_RE = /\{\{[^}]+\}\}/g;

function protectPlaceholders(text) {
  const holders = [];
  const protected_ = text.replace(PLACEHOLDER_RE, (match) => {
    const idx = holders.length;
    holders.push(match);
    return `[[${idx}]]`;
  });
  return { protected: protected_, holders };
}

function restorePlaceholders(text, holders) {
  return text.replace(/\[\[(\d+)\]\]/g, (_, i) => holders[parseInt(i)] ?? _);
}

// Translate an array of strings in one API batch call
async function translateBatch(texts, targetLang) {
  const protected_ = texts.map(protectPlaceholders);
  const contents = protected_.map(p => p.protected);

  const [response] = await client.translateText({
    parent: `projects/${PROJECT}/locations/${LOCATION}`,
    contents,
    mimeType: 'text/plain',
    sourceLanguageCode: 'en',
    targetLanguageCode: targetLang,
  });

  return response.translations.map((t, i) =>
    restorePlaceholders(t.translatedText, protected_[i].holders)
  );
}

const BATCH_SIZE = 100; // Google Cloud limit per request

async function translateAll(flat, targetLang) {
  const keys = Object.keys(flat);
  const values = Object.values(flat);
  const translated = [];

  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    const chunk = values.slice(i, i + BATCH_SIZE);
    const results = await translateBatch(chunk, targetLang);
    translated.push(...results);
    if (i + BATCH_SIZE < values.length) {
      // brief pause to avoid quota bursts
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const result = {};
  keys.forEach((k, i) => { result[k] = translated[i]; });
  return result;
}

async function main() {
  const en = JSON.parse(readFileSync(EN_FILE, 'utf8'));
  const flat = flatten(en);
  const keyCount = Object.keys(flat).length;
  console.log(`English master: ${keyCount} keys`);

  for (const lang of LANGUAGES) {
    const dir = join(LOCALES_DIR, lang.code);
    const file = join(dir, 'translation.json');

    // Skip if already complete
    if (existsSync(file)) {
      const existing = JSON.parse(readFileSync(file, 'utf8'));
      const existingFlat = flatten(existing);
      if (Object.keys(existingFlat).length === keyCount) {
        console.log(`  ✓ ${lang.code} (${lang.name}) — already complete, skipping`);
        continue;
      }
    }

    process.stdout.write(`  → ${lang.code} (${lang.name})… `);
    try {
      const translatedFlat = await translateAll(flat, lang.code);
      const nested = unflatten(translatedFlat);
      mkdirSync(dir, { recursive: true });
      writeFileSync(file, JSON.stringify(nested, null, 2) + '\n', 'utf8');
      console.log('done');
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
    }
  }

  console.log('\nAll languages processed.');
}

main().catch(err => { console.error(err); process.exit(1); });
