import { promises as fs } from 'fs';
import path from 'path';

export async function getAgentsTemplate(): Promise<string> {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const agentsMdPath = path.join(__dirname, 'agents.md');
  return await fs.readFile(agentsMdPath, 'utf-8');
}
