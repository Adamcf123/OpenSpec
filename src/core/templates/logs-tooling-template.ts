import { promises as fs } from 'fs';
import path from 'path';

export async function getLogsToolingTemplate(): Promise<string> {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const mdPath = path.join(__dirname, 'logs-tooling.md');
  return await fs.readFile(mdPath, 'utf-8');
}
