# OpenSpec 项目上下文

## Purpose
OpenSpec 是一个面向 AI 编码助手的原生“规范驱动开发”系统，通过在实现前以可验证的规格达成一致，确保输出可审查、可验证与可追溯。

## Tech Stack
- 语言/运行时：TypeScript (ES2022)、Node.js (>= 20.19.0)（package.json:55）
- 模块/打包：ESM、`tsc` 编译，`build.js` 产物到 `dist/`（build.js:22、tsconfig.json:4-9）
- CLI 框架：`commander`（src/cli/index.ts:1,21-24）
- 交互/终端：`@inquirer/core`、`@inquirer/prompts`、`ora`、`chalk`（package.json:66-71）
- 验证/模式：`zod`（package.json:71）
- 测试：`vitest`（vitest.config.ts:1-5,10,22-24）
- 发布/版本：`changesets`（package.json:58-63,51-53）

## Project Conventions

### Code Style
- TypeScript 严格模式与 NodeNext 解析，ES2022 目标（tsconfig.json:3-7,11）
- 源码位于 `src/`，编译输出到 `dist/`；CLI 入口 `bin/openspec.js` 指向 `dist/cli/index.js`（package.json:29-31, exports:24-27, bin/openspec.js:3）
- 无仓库级 ESLint/Prettier 配置文件；遵循 TypeScript 编译器约束（tsconfig.json 全局）

### Architecture Patterns
- 目录分层：
  - `openspec/`：项目规格与变更（specs/、changes/、archive/）（src/core/init.ts:711-717）
  - `src/cli/`：CLI 命令装配（src/cli/index.ts:21-24,40-251）
  - `src/core/`：核心能力（init/list/update/archive/view、模板、配置器、样式）（src/cli/index.ts:6-15）
  - `src/core/configurators/`：工具适配注册与实现（src/core/configurators/registry.ts:10-29）
  - `src/core/templates/`：模板与文档片段（build.js:30-37, src/core/templates/index.ts）
- 关键模式：
  - 规格即真（specs 为已实现事实；changes 为提案；archive 为完成项）（openspec/AGENTS.md:124-142,523-529）
  - 变更以 Delta 形式表达 ADDED/MODIFIED/REMOVED/RENAMED（openspec/AGENTS.md:350-363）
  - CLI 基于命令聚合与职责分离（src/cli/index.ts 各命令段）
  - 工具集成通过注册表与适配器（src/core/configurators/registry.ts:10-29）

### Testing Strategy
- 测试运行器：Vitest，Node 环境、全局启用、10s 超时（vitest.config.ts:4-7,22-24）
- 覆盖率：text/json/html，排除 `test/**`、`dist/`、`bin/` 等（vitest.config.ts:11-20）
- 结构：测试位于 `test/**`，以 `*.test.ts` 命名（vitest.config.ts:10；例如 test/core/init.test.ts）

### Git Workflow
- 提交信息：Conventional Commits（从历史与 scripts/release 流程推断；package.json:50-53）
- 版本与发布：Changesets 驱动发布（package.json:50-53）
- 分支策略：未在仓库内强约束，遵循常规 feature 分支工作流（无 husky/lint-staged 配置）

## Domain Context
- OpenSpec 关键概念：
  - `specs/`：系统当前真相（已实现）（openspec/AGENTS.md:124-133,523-529）
  - `changes/`：提案（应当改变的内容）（同上）
  - `archive/`：已部署完成的变更（同上）
  - `deltas`：ADDED/MODIFIED/REMOVED/RENAMED 要求块（openspec/AGENTS.md:350-363）
- 主要 CLI 命令：
  - `init` 初始化（src/cli/index.ts:40-74）
  - `update` 刷新指令文件（src/cli/index.ts:76-89）
  - `list`（含 `--specs`）列出变更或规格（src/cli/index.ts:91-106）
  - `view` 交互式总览（src/cli/index.ts:108-120）
  - `change` 组命令（show/list/validate，已标记为 deprecated 方向）（src/cli/index.ts:122-183,127-131）
  - 顶层 `validate`/`show`（src/cli/index.ts:201-251,203-224,226-251）
  - `archive` 归档（src/cli/index.ts:184-199）
- 工具生态：通过注册表支持多助手（Claude、Cline、CodeBuddy、Qwen、Qoder、Agents Stub 等）（src/core/configurators/registry.ts:14-29）

## Important Constraints
- Node.js 版本要求：`>= 20.19.0`（package.json:55-57）
- 规格撰写硬性格式约束：
  - 每个 Requirement 至少一个 `#### Scenario:`，严格标题格式（openspec/AGENTS.md:329-346）
  - 变更操作必须位于对应分节（ADDED/MODIFIED/REMOVED/RENAMED）（openspec/AGENTS.md:350-363）
  - 修改现有 Requirement 时应粘贴完整块再编辑（openspec/AGENTS.md:366-371）
- 架构优先：遵循 `Architecture-First` 指南（openspec/AGENTS.md:468-476）
- 生成/复制模板：构建时复制 `agents.md` 与 CLI 模板目录（build.js:28-44）

## External Dependencies
- 运行时依赖：
  - `commander` —— CLI 入口与命令解析（src/cli/index.ts:1,21-24；package.json:69）
  - `@inquirer/core`/`@inquirer/prompts` —— 交互式选择（src/core/init.ts:3-12,100-169；package.json:66-67）
  - `ora` —— 终端进度与信息（src/core/init.ts:14,966-973；package.json:70）
  - `chalk` —— 控制台着色（src/core/init.ts:13；package.json:68）
  - `zod` —— 结构化验证（package.json:71；用于配置与解析流程，多处）
- 开发依赖：`typescript`、`vitest`、`@vitest/ui`、`@changesets/cli`（package.json:58-63）
