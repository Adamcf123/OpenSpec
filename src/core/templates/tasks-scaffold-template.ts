import { promises as fs } from 'fs';
import path from 'path';

export async function getTasksScaffoldTemplate(): Promise<string> {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const tasksTemplatePath = path.join(
    __dirname,
    'claude-code-cli-slash-commands-templates',
    'tasks.md'
  );
  return await fs.readFile(tasksTemplatePath, 'utf-8');
}
