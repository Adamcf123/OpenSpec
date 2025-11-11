import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';
import { FileSystemUtils } from '../../../utils/file-system.js';

export const CLAUDE_CODE_CLI_COMMANDS_BASE_PATH = '.claude/commands/openspec';

export const CLAUDE_CODE_CLI_SLASH_COMMAND_PATHS: Record<SlashCommandId, string> = {
  proposal: `${CLAUDE_CODE_CLI_COMMANDS_BASE_PATH}/proposal.md`,
  apply: `${CLAUDE_CODE_CLI_COMMANDS_BASE_PATH}/apply.md`,
  archive: `${CLAUDE_CODE_CLI_COMMANDS_BASE_PATH}/archive.md`
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: OpenSpec: Proposal
description: 起草新的 OpenSpec 提案；生成变更骨架并完成最小可验证规格
category: OpenSpec
tags: [openspec, change]
argument-hint: [title|description|prelude-id] [primary-capability]
allowed-tools: *
---`,
  apply: `---
name: OpenSpec: Apply
description: 实施已批准的 OpenSpec 变更；严格按 tasks.md 执行并产出证据
category: OpenSpec
tags: [openspec, apply]
argument-hint: [change-id|query]
allowed-tools: *
---`,
  archive: `---
name: OpenSpec: Archive
description: 归档 OpenSpec 变更并刷新规格；参数可为 change-id 或检索关键词
category: OpenSpec
tags: [openspec, archive]
argument-hint: [change-id|query] [--skip-specs]
allowed-tools: *
---`
};

export class ClaudeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'claude';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return CLAUDE_CODE_CLI_SLASH_COMMAND_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }

  // 无条件覆盖：始终写入 frontmatter + body
  async generateAll(projectPath: string, _openspecDir: string): Promise<string[]> {
    const createdOrUpdated: string[] = [];
    for (const target of this.getTargets()) {
      const rawBody = this.getBody(target.id);
      const body = this.normalizeClaudeBody(rawBody);
      const filePath = FileSystemUtils.joinPath(projectPath, target.path);
      const frontmatter = this.getFrontmatter(target.id);
      const sections: string[] = [];
      if (frontmatter) sections.push(frontmatter.trim());
      sections.push(body.trim());
      const content = sections.join('\n\n') + '\n';
      await FileSystemUtils.writeFile(filePath, content);
      createdOrUpdated.push(target.path);
    }
    return createdOrUpdated;
  }

  private normalizeClaudeBody(body: string): string {
    const trimmed = body.trimStart();
    if (trimmed.startsWith('---')) {
      const end = trimmed.indexOf('\n---', 3);
      if (end !== -1) {
        const after = trimmed.slice(end + '\n---'.length);
        const withoutLeadingBlank = after.replace(/^\s*\n/, '');
        return withoutLeadingBlank.trim();
      }
    }
    return body.trim();
  }
}
