import fs from 'fs';
import path from 'path';

interface Voter {
  serial_no?: string;
  house_no?: string;
  name?: string;
  relation?: string;
  relation_name?: string;
  gender?: string;
  age?: string;
  epic_no?: string;
  page?: number;
  constituency_number?: string;
  part_number?: string;
}

let cachedIndex: { voters: Voter[] } | null = null;

function loadAllVoters(dataDir: string): Voter[] {
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  const allVoters: Voter[] = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);
      if (json.voters && Array.isArray(json.voters)) {
        allVoters.push(...json.voters);
      }
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
    }
  }
  return allVoters;
}

export function getSearchIndex(): { voters: Voter[] } {
  if (cachedIndex) return cachedIndex;

  const dataDir = process.env.JSON_DATA_DIR || './data/json_output';
  const absoluteDir = path.resolve(process.cwd(), dataDir);

  if (!fs.existsSync(absoluteDir)) {
    console.warn(`Data directory not found: ${absoluteDir}`);
    cachedIndex = { voters: [] };
    return cachedIndex;
  }

  const voters = loadAllVoters(absoluteDir);
  cachedIndex = { voters };
  return cachedIndex;
}