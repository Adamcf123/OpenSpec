import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CLAUDE_CODE_CLI_SLASH_COMMAND_PATHS,
  ClaudeSlashCommandConfigurator
} from '../../../../src/core/configurators/slash/claude.js';
import { FileSystemUtils } from '../../../../src/utils/file-system.js';
import { TemplateManager } from '../../../../src/core/templates/index.js';

describe('ClaudeSlashCommandConfigurator', () => {
  const projectPath = '/project';
  let configurator: ClaudeSlashCommandConfigurator;

  beforeEach(() => {
    vi.restoreAllMocks();
    configurator = new ClaudeSlashCommandConfigurator();
  });

  it('writes slash command files with normalized claude content', async () => {
    const fileNames = [
      CLAUDE_CODE_CLI_SLASH_COMMAND_PATHS.proposal,
      CLAUDE_CODE_CLI_SLASH_COMMAND_PATHS.apply,
      CLAUDE_CODE_CLI_SLASH_COMMAND_PATHS.archive
    ];

    const writeSpy = vi
      .spyOn(FileSystemUtils, 'writeFile')
      .mockResolvedValue();

    const bodySpy = vi
      .spyOn(TemplateManager, 'getSlashCommandBody')
      .mockReturnValue(`---
front: matter
---

Body content
`);

    await configurator.generateAll(projectPath, '');

    expect(bodySpy).toHaveBeenCalledTimes(3);
    expect(writeSpy).toHaveBeenCalledTimes(3);

    writeSpy.mock.calls.forEach(([targetPath, content], index) => {
      expect(targetPath).toBe(FileSystemUtils.joinPath(projectPath, fileNames[index]));
      expect(content).toMatch(/^---\nname: OpenSpec:/);
      expect(content).not.toContain('front: matter');
      expect(content.trim()).toMatch(/Body content$/);
    });
  });
});
