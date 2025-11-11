import path from 'path';
import { getAgentsTemplate } from './agents-template.js';
import { projectTemplate, ProjectContext } from './project-template.js';
import { claudeTemplate } from './claude-template.js';
import { clineTemplate } from './cline-template.js';
import { costrictTemplate } from './costrict-template.js';
import { agentsRootStubTemplate } from './agents-root-stub.js';
import { getSlashCommandBody, SlashCommandId } from './slash-command-templates.js';
import { getTasksScaffoldTemplate } from './tasks-scaffold-template.js';
import { getLogsToolingTemplate } from './logs-tooling-template.js';

export interface Template {
  path: string;
  content: string | ((context: ProjectContext) => string);
}

export class TemplateManager {
  static async getTemplates(context: ProjectContext = {}): Promise<Template[]> {
    const agentsTemplate = await getAgentsTemplate();
    const tasksScaffold = await getTasksScaffoldTemplate();
    const logsTooling = await getLogsToolingTemplate();
    return [
      {
        path: 'AGENTS.md',
        content: agentsTemplate
      },
      {
        path: 'project.md',
        content: projectTemplate(context)
      },
      {
        path: path.join('changes', '_template', 'tasks.md'),
        content: tasksScaffold
      },
      {
        path: path.join('logs', 'logs-tooling.md'),
        content: logsTooling
      }
    ];
  }

  static getClaudeTemplate(): string {
    return claudeTemplate;
  }

  static getClineTemplate(): string {
    return clineTemplate;
  }

  static getCostrictTemplate(): string {
    return costrictTemplate;
  }

  static getAgentsStandardTemplate(): string {
    return agentsRootStubTemplate;
  }

  static getSlashCommandBody(id: SlashCommandId): string {
    return getSlashCommandBody(id);
  }
}

export { ProjectContext } from './project-template.js';
export type { SlashCommandId } from './slash-command-templates.js';
