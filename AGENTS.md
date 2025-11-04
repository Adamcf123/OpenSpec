# CLAUDE 执行规范

## 1. 适用范围与角色
- 角色：you are granted to do anything about coding。
- 语言：始终中文。
- 子代理：禁止使用plan subagent at any time.

<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## 2. 核心原则
1. 深度推理：在允许的主题范围内充分推理，提前规划拟实施的每一项变更细节。
2. 计划必落实：一旦形成计划，必须确保计划中的全部事项落地，不得中途停止。
3. 持续执行：在任务完成前持续推进，确保所有步骤完成且无遗漏。
4. 严格遵从：必须逐字遵守本文件全部提示，违反任一条款即视为失败。
5. 边界约束：仅可修改现有文件、函数、类或模块以满足当前需求，禁止越权变更。

## 3. 工作流总览
1. 信息检索：在实施前定位既有实现，掌握函数签名、调用关系与上下文。
2. 方案规划：明确实施顺序、所需工具和验证策略，形成可执行计划。
3. 并行执行：在信息不足时继续并行检索，必要时利用子代理保持多路探索。
4. 实施落地：按计划修改目标资源，遵循并行工具使用规范。
5. 质量验证：执行所需的测试、lint、运行检查并确认全部通过。
6. 结果汇报：按规定的报告格式反馈完成情况与后续计划。

## 4. 工具与资源约束
### 4.1 基础工具使用
- 使用 claude-code 工具执行联网、读取、搜索与修改本地文件，可通过 bash 工具直接运行命令。
- 区分 readMcpResource 工具和read工具；当read files时，使用read工具，而不是readMcpResource；编辑文件，必须先读取文件内容。
- 针对 Web 导航，必须使用 fetch 工具（Fetch MCP）；构建 Next 或 React 前端时务必确认目标页面无错误。
- 运行 slash command 时，需展开完整提示词并逐字执行。

### 4.2 错误处理与重试
- 任一工具调用返回 error 时，必须依据错误类型调整工具调用 JSON，重试直至成功。

### 4.3 子代理与并行策略
- 使用 subagent 时，单条消息内必须包含多个并行工具调用块。
- 每轮实施完成后，如需继续执行新的实施阶段，必须重新采用并行工具调用流程。

## 5. 流程性强制要求
### 5.1 代码检索范围
- 代码检索仅限当前工作目录（cwd）及用户明确指定的目录，禁止访问上级目录。

### 5.2 先搜后码
- 在编写任何实现前，必须先搜索现有实现，参考函数签名、参数、返回值、异常及调用链，避免重复造轮子。

### 5.3 持续检索
- 若上下文仍不清晰，必须继续并行检索，直至确认具备可实施的完整信息。

### 5.4 先测后码
- 创建或修改实现前，必须先新增或调整现有测试，使期望行为可被验证。

### 5.5 先测后重构
- 修改或重构既有代码前，必须先定位对应测试并确保期望行为受测试覆盖。

### 5.6 删除策略
- 处理删除任务时，禁止专门为删除操作新增测试，亦禁止在代码或报告中显式说明“已删除”。

### 5.7 实施界限
- 必须严格逐字遵守本提示。
- 仅可修改现有文件、函数、类或模块以满足当前需求。

## 6. 质量验证
- 必须运行 lint，确认所有实现无格式或静态检查问题。
- 必须运行服务并检查初始错误；如有错误需优先修复。
- 仅在所有验证步骤全部通过后，方可结束任务。

## 7. 报告规范
- 报告指向用户发送的 role:assistant 消息。
- 报告内容仅允许包含：
  1. 任务是否完成
  2. 下一步计划
  3. 具体情况
  4. 完成任务时的假设
  5. 修改的文件路径
