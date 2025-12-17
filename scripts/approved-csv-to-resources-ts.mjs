import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const csvPath = join(rootDir, 'data', 'approved.csv');
const outputPath = join(rootDir, 'data', 'resources.ts');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCSV(text) {
  const lines = [];
  let currentLine = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentField);
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentLine.push(currentField);
      if (currentLine.some(field => field.trim())) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentField = '';
    } else if (char === '\r' && nextChar === '\n' && !inQuotes) {
      currentLine.push(currentField);
      if (currentLine.some(field => field.trim())) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentField = '';
      i++;
    } else {
      currentField += char;
    }
  }

  if (currentField || currentLine.length) {
    currentLine.push(currentField);
    if (currentLine.some(field => field.trim())) {
      lines.push(currentLine);
    }
  }

  return lines;
}

function mapCategory(typeValue) {
  const normalized = typeValue.toLowerCase().trim();
  if (normalized.includes('app') || normalized.includes('software') || normalized.includes('extension')) {
    return 'tool';
  }
  if (normalized.includes('practice') || normalized.includes('framework') || normalized.includes('routine')) {
    return 'method';
  }
  if (normalized.includes('group') || normalized.includes('body doubling') || normalized.includes('co-working')) {
    return 'community';
  }
  if (normalized.includes('video') || normalized.includes('podcast') || normalized.includes('book') || normalized.includes('newsletter')) {
    return 'content';
  }
  if (normalized.includes('timer') || normalized.includes('journal') || normalized.includes('device')) {
    return 'physical';
  }
  return 'tool';
}

function mapSupportNeeds(helpsWithValue) {
  const mapping = {
    'time awareness': 'time_blindness',
    'starting tasks': 'task_initiation',
    'prioritizing': 'prioritization',
    'planning & organization': 'planning',
    'planning and organization': 'planning',
    'remembering steps & details': 'working_memory',
    'remembering steps and details': 'working_memory',
    'following through': 'follow_through',
    'staying focused': 'focus',
    'reducing distractions': 'distraction',
    'switching tasks': 'transitioning',
    'feeling overwhelmed': 'overwhelm',
    'sensory sensitivity': 'sensory_sensitivity',
    'low-energy days': 'low_energy',
    'low energy days': 'low_energy',
    'accessibility support': 'accessibility_support',
  };

  const parts = helpsWithValue.split(/[,;]/).map(s => s.trim().toLowerCase());
  const needs = [];

  for (const part of parts) {
    if (mapping[part]) {
      needs.push(mapping[part]);
    }
  }

  return [...new Set(needs)];
}

function normalizeValue(value, options, defaultValue) {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase().trim();
  if (normalized === 'not sure' || normalized === '') return defaultValue;

  for (const option of options) {
    if (normalized === option.toLowerCase()) {
      return option.toLowerCase();
    }
  }

  return defaultValue;
}

function getDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

function getFirstSentence(text) {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text.substring(0, 120) + '...';
}

function isTruthy(value) {
  if (!value) return false;
  const normalized = value.toLowerCase().trim();
  return normalized === 'true' || normalized === 'yes' || normalized === '1';
}

function main() {
  if (!existsSync(csvPath)) {
    console.error(`Error: CSV file not found at ${csvPath}`);
    console.log('Please add your approved.csv file to the data/ directory.');
    process.exit(1);
  }

  const csvContent = readFileSync(csvPath, 'utf-8');
  const lines = parseCSV(csvContent);

  if (lines.length === 0) {
    console.error('Error: CSV file is empty');
    process.exit(1);
  }

  const headers = lines[0].map(h => h.trim());
  const rows = lines.slice(1);

  const getColumnIndex = (name) => {
    const index = headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
    return index;
  };

  const resources = [];
  const idCounts = new Map();

  for (const row of rows) {
    const getValue = (columnName, defaultValue = '') => {
      const index = getColumnIndex(columnName);
      return index >= 0 && row[index] ? row[index].trim() : defaultValue;
    };

    const approved = getValue('Approved');
    if (!isTruthy(approved)) {
      continue;
    }

    const title = getValue('Resource name');
    const url = getValue('Link to the resource');

    if (!title || !url) {
      continue;
    }

    const typeValue = getValue('What type is this?');
    const category = mapCategory(typeValue);

    const helpsWithValue = getValue('What does this help with?');
    const support_needs = mapSupportNeeds(helpsWithValue);

    const why_it_helps = getValue('Why is this helpful?');
    const description = why_it_helps ? getFirstSentence(why_it_helps) : '';

    const sensory_load = normalizeValue(getValue('Sensory Load (Optional)'), ['low', 'medium', 'high'], 'low');
    const setup_effort = normalizeValue(getValue('Setup effort (optional)'), ['low', 'medium', 'high'], 'low');
    const price_type = normalizeValue(getValue('Price type (Optional)'), ['free', 'freemium', 'paid'], 'freemium');

    const featured = isTruthy(getValue('Featured'));
    const domain = getDomain(url);

    let baseId = slugify(title);
    let id = baseId;
    const count = idCounts.get(baseId) || 0;
    if (count > 0) {
      id = `${baseId}-${count + 1}`;
    }
    idCounts.set(baseId, count + 1);

    resources.push({
      id,
      title,
      url,
      description,
      why_it_helps,
      category,
      support_needs,
      sensory_load,
      setup_effort,
      price_type,
      featured,
      affiliate_url: null,
      is_affiliate: false,
      domain,
    });
  }

  resources.sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return a.title.localeCompare(b.title);
  });

  const output = `// Auto-generated from data/approved.csv
// Do not edit this file directly. Run 'npm run build:data' to regenerate.

import type { Resource } from "@/types/resource";

export const resources: Resource[] = ${JSON.stringify(resources, null, 2)};
`;

  writeFileSync(outputPath, output, 'utf-8');
  console.log(`✅ Generated ${resources.length} resources -> ${outputPath}`);
}

main();
