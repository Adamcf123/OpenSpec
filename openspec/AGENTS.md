# OpenSpec Instructions

Instructions for AI coding assistants using OpenSpec for spec-driven development.

## TL;DR Quick Checklist

- Search existing work: `openspec spec list --long`, `openspec list` (use `rg` only for full-text search)
- Decide scope: new capability vs modify existing capability
- Pick a unique `change-id`: kebab-case, verb-led (`add-`, `update-`, `remove-`, `refactor-`)
- Scaffold: `proposal.md`, `tasks.md`, `design.md`, and delta specs per affected capability
- Write deltas: use `## ADDED|MODIFIED|REMOVED|RENAMED Requirements`; include at least one `#### Scenario:` per requirement
- Validate: 设置 `ID=<change-id>` 并运行 `openspec validate "$ID" --strict`，修复所有问题
- Request approval: Do not start implementation until proposal is approved

## Three-Stage Workflow

### Stage 1: Creating Changes
Create proposal when you need to:
- Add features or functionality
- Make breaking changes (API, schema)
- Change architecture or patterns
- Optimize performance (changes behavior)
- Update security patterns

Triggers (examples):
- "Help me create a change proposal"
- "Help me plan a change"
- "Help me create a proposal"
- "I want to create a spec proposal"
- "I want to create a spec"

Loose matching guidance:
- Contains one of: `proposal`, `change`, `spec`
- With one of: `create`, `plan`, `make`, `start`, `help`

Skip proposal for:
- Bug fixes (restore intended behavior)
- Typos, formatting, comments
- Dependency updates (non-breaking)
- Configuration changes
- Tests for existing behavior

**Workflow**
1. Review `openspec/project.md`, `openspec list`, and `openspec/list --specs` to understand current context.
2. Choose a unique verb-led `change-id` and scaffold `proposal.md`, `tasks.md`, `design.md`, and spec deltas under `openspec/changes/<id>/`.
3. Draft spec deltas using `## ADDED|MODIFIED|REMOVED Requirements` with at least one `#### Scenario:` per requirement.
4. 设置 `ID=<change-id>` 并运行 `openspec validate "$ID" --strict`，在共享提案前修复所有问题。

### Stage 2: Implementing Changes
Track these steps as TODOs and complete them one by one.
1. **Read proposal.md** - Understand what's being built
2. **Read design.md** - Review technical decisions
3. **Read tasks.md** - Get implementation checklist
4. **Implement tasks sequentially** - Complete in order
5. **Confirm completion** - Ensure every item in `tasks.md` is finished before updating statuses
6. **Update checklist** - After all work is done, set every task to `- [x]` so the list reflects reality
7. **Approval gate** - Do not start implementation until the proposal is reviewed and approved

### Stage 3: Archiving Changes
After deployment, create separate PR to:
- Move `changes/[name]/` → `changes/archive/YYYY-MM-DD-[name]/`
- Update `specs/` if capabilities changed
- 设置 `ID=<change-id>` 并运行 `openspec archive "$ID" --skip-specs --yes` 以处理仅影响工具的变更（始终显式传入变更 ID）
- Run `openspec validate --strict` to confirm the archived change passes checks

## Before Any Task

**Context Checklist:**
- [ ] Read relevant specs in `specs/[capability]/spec.md`
- [ ] Check pending changes in `changes/` for conflicts
- [ ] Read `openspec/project.md` for conventions
- [ ] Run `openspec list` to see active changes
- [ ] Run `openspec/list --specs` to see existing capabilities

**Before Creating Specs:**
- Always check if capability already exists
- Prefer modifying existing specs over creating duplicates
- Use `openspec show [spec]` to review current state
- If request is ambiguous, ask 1–2 clarifying questions before scaffolding

### Search Guidance
- Enumerate specs: `openspec spec list --long` (or `--json` for scripts)
- Enumerate changes: `openspec list` (or `openspec change list --json` - deprecated but available)
- Show details:
  - Spec: `openspec show [spec-id] --type spec` (use `--json` for filters)
  - Change: `openspec show "$ID" --json --deltas-only`
- Full-text search (use ripgrep): `rg -n "Requirement:|Scenario:" openspec/specs`

## Quick Start

### CLI Commands

```bash
# Essential commands
openspec list                  # List active changes
openspec list --specs          # List specifications
openspec show [item]           # Display change or spec
openspec validate [item]       # Validate changes or specs
ID=<change-id>                  # Set once and reuse for archive/validate
openspec archive "$ID" [--yes|-y]   # Archive after deployment (add --yes for non-interactive runs)

# Project management
openspec init [path]           # Initialize OpenSpec
openspec update [path]         # Update instruction files

# Interactive mode
openspec show                  # Prompts for selection
openspec validate              # Bulk validation mode

# Debugging
openspec show "$ID" --json --deltas-only
openspec validate "$ID" --strict
```

### Command Flags

- `--json` - Machine-readable output
- `--type change|spec` - Disambiguate items
- `--strict` - Comprehensive validation
- `--no-interactive` - Disable prompts
- `--skip-specs` - Archive without spec updates
- `--yes`/`-y` - Skip confirmation prompts (non-interactive archive)

## Directory Structure

```
openspec/
├── project.md              # Project conventions
├── specs/                  # Current truth - what IS built
│   └── [capability]/       # Single focused capability
│       ├── spec.md         # Requirements and scenarios
│       └── design.md       # Technical patterns
├── changes/                # Proposals - what SHOULD change
│   ├── [change-name]/
│   │   ├── proposal.md     # Why, what, impact
│   │   ├── tasks.md        # Implementation checklist
│   │   ├── design.md       # Technical decisions
│   │   └── specs/          # Delta changes
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # Completed changes
```

## Creating Change Proposals

### Decision Tree

```
New request?
├─ Bug fix restoring spec behavior? → Fix directly
├─ Typo/format/comment? → Fix directly
├─ New feature/capability? → Create proposal
├─ Breaking change? → Create proposal
├─ Architecture change? → Create proposal
└─ Unclear? → Create proposal (safer)
```

### Proposal Structure

1. **Create directory:** `changes/[change-id]/` (kebab-case, verb-led, unique)

2. **Write proposal.md:**
```markdown
# Change: <Concise change name>

## Why
- Problem statement: <Which user pain or limitation are we addressing?>
- Evidence: <Logs, metrics, support tickets, or user reports proving the issue exists>
- Business impact: <What happens if we do nothing?>

## What Changes
### Capability Summary
- Scope: <Which product areas or flows are touched?>
- Guardrails: <Any out-of-scope constraints or assumptions?>

### Technical Approach
1. Backend:
   - <API/service updates, data model migrations, new jobs>
   - <Integration/backward compatibility considerations>
2. Frontend/Client:
   - <UI changes, state management, routing>
   - <Accessibility or localization notes>
3. Tooling & Ops:
   - <CLI commands, scripts, config flags>

## Impact
- Specs to update: <capability IDs>
- Code hot spots: <key files or directories>
- Risks: <top 2 failure modes and mitigations>
- Stakeholders: <teams or roles to review>

## Open Questions
- <Decision still pending>
```

3. **Create spec deltas:** `specs/[capability]/spec.md`
```markdown
## ADDED Requirements
### Requirement: <New Requirement Name>
The system SHALL <describe the new capability>.

#### Scenario: Happy path
- **WHEN** <primary trigger>
- **THEN** <expected outcome>

#### Scenario: Failure handling
- **WHEN** <error or invalid condition>
- **THEN** <fallback behaviour>

## MODIFIED Requirements
### Requirement: <Existing Requirement Name>
<Restated requirement with updated behaviour across all scenarios>

#### Scenario: <Scenario Name>
- **WHEN** <condition>
- **THEN** <outcome>

## REMOVED Requirements
### Requirement: <Removed Requirement Name>
**Reason**: <Why it is obsolete>
**Migration**: <Rollout/migration guidance>
```
If multiple capabilities are affected, create multiple delta files under `changes/[change-id]/specs/<capability>/spec.md`—one per capability.

4. **Create detailed tasks.md:**
Break down the work into granular、可验证的步骤，每个任务都应该产生可交付成果或验证结果，避免泛泛而谈的描述。建议按照「调研 → 实施 → 验证 → 发布」拆分章节，并在每个任务中明确输入、产出与负责人。

推荐任务模板：
```markdown
## 0. Discovery & Alignment
- [ ] 0.1 Stakeholder sync → <会议/确认事项>
- [ ] 0.2 Read historical context → <相关 PR / spec>
- [ ] 0.3 Capture open risks → 更新 proposal.md

## 1. Backend / API
- [ ] 1.1 Schema change → <文件/迁移脚本>
- [ ] 1.2 Service logic → <函数或模块名>
- [ ] 1.3 Observability → <日志、指标、报警>

## 2. Frontend / Client
- [ ] 2.1 UX update → <页面或组件>
- [ ] 2.2 Data wiring → <hook/store 调整>
- [ ] 2.3 Edge cases → <空态、错误态>

## 3. Validation
- [ ] 3.1 Unit tests → <测试文件或套件>
- [ ] 3.2 Integration/E2E → <测试场景>
- [ ] 3.3 Manuals → <需要手测的路径>

## 4. Rollout & Docs
- [ ] 4.1 Deploy plan → <灰度/feature flag>
- [ ] 4.2 Documentation → <README、Changelog>
- [ ] 4.3 Handoff → <同步对象/渠道>
```

**Good Example:**
```markdown
## 1. Backend API
- [ ] 1.1 Add `/users/{id}/profile` GET route
- [ ] 1.2 Create `getUserProfile` controller function
- [ ] 1.3 Implement database query in `UserService`
- [ ] 1.4 Add Zod validation for the response payload

## 2. Frontend Component
- [ ] 2.1 Create `UserProfile.tsx` component skeleton
- [ ] 2.2 Fetch data from the API endpoint
- [ ] 2.3 Render user profile information
- [ ] 2.4 Add loading and error states

## 3. Testing
- [ ] 3.1 Write unit tests for `UserService`
- [ ] 3.2 Write integration test for the API endpoint
- [ ] 3.3 Write E2E test for the user profile page
```

**Bad Example (too vague):**
```markdown
## 1. Implementation
- [ ] 1.1 Create database schema
- [ ] 1.2 Implement API endpoint
- [ ] 1.3 Add frontend component
- [ ] 1.4 Write tests
```

5. **Create design.md:**
Always create a `design.md` to document technical decisions before coding. Use it for every change, regardless of size or complexity。确保覆盖数据流、接口契约、失败模式与迁移路径。

推荐 `design.md` 模板：
```markdown
## Context
- Current behaviour: <现状描述>
- Pain points: <为什么需要改动>
- Constraints: <技术/业务限制>

## Goals / Non-Goals
- Goals: <交付目标>
- Non-Goals: <明确不做的范围>

## Architecture Overview
- High-level diagram: <文字描述或链接>
- Data flow: <请求响应路径、消息流>
- External dependencies: <服务、第三方系统>

## Decisions
- Decision 1: <内容>
  - Rationale: <原因>
  - Alternatives: <考虑过的选项>
- Decision 2: ...

## Failure Modes & Mitigations
- <场景> → <监控/报警/降级策略>

## Rollout / Migration Plan
1. <步骤1>
2. <步骤2>
3. Rollback strategy: <如何回滚>

## Test Strategy
- Unit: <关键模块>
- Integration: <跨服务验证>
- Manual: <手动检查项目>

## Open Questions
- <待确认事项>
```

## Spec File Format

### Critical: Scenario Formatting

**CORRECT** (use #### headers):
```markdown
#### Scenario: User login success
- **WHEN** valid credentials provided
- **THEN** return JWT token
```

**WRONG** (don't use bullets or bold):
```markdown
- **Scenario: User login**  ❌
**Scenario**: User login     ❌
### Scenario: User login      ❌
```

Every requirement MUST have at least one scenario.

### Requirement Wording
- Use SHALL/MUST for normative requirements (avoid should/may unless intentionally non-normative)

### Delta Operations

- `## ADDED Requirements` - New capabilities
- `## MODIFIED Requirements` - Changed behavior
- `## REMOVED Requirements` - Deprecated features
- `## RENAMED Requirements` - Name changes

Headers matched with `trim(header)` - whitespace ignored.

#### When to use ADDED vs MODIFIED
- ADDED: Introduces a new capability or sub-capability that can stand alone as a requirement. Prefer ADDED when the change is orthogonal (e.g., adding "Slash Command Configuration") rather than altering the semantics of an existing requirement.
- MODIFIED: Changes the behavior, scope, or acceptance criteria of an existing requirement. Always paste the full, updated requirement content (header + all scenarios). The archiver will replace the entire requirement with what you provide here; partial deltas will drop previous details.
- RENAMED: Use when only the name changes. If you also change behavior, use RENAMED (name) plus MODIFIED (content) referencing the new name.

Common pitfall: Using MODIFIED to add a new concern without including the previous text. This causes loss of detail at archive time. If you aren't explicitly changing the existing requirement, add a new requirement under ADDED instead.

Authoring a MODIFIED requirement correctly:
1) Locate the existing requirement in `openspec/specs/<capability>/spec.md`.
2) Copy the entire requirement block (from `### Requirement: ...` through its scenarios).
3) Paste it under `## MODIFIED Requirements` and edit to reflect the new behavior.
4) Ensure the header text matches exactly (whitespace-insensitive) and keep at least one `#### Scenario:`.

Example for RENAMED:
```markdown
## RENAMED Requirements
- FROM: `### Requirement: Login`
- TO: `### Requirement: User Authentication`
```

## Troubleshooting

### Common Errors

**"Change must have at least one delta"**
- Check `changes/[name]/specs/` exists with .md files
- Verify files have operation prefixes (## ADDED Requirements)

**"Requirement must have at least one scenario"**
- Check scenarios use `#### Scenario:` format (4 hashtags)
- Don't use bullet points or bold for scenario headers

**Silent scenario parsing failures**
- Exact format required: `#### Scenario: Name`
- Debug with: `openspec show [change] --json --deltas-only`

### Validation Tips

```bash
# Always use strict mode for comprehensive checks
openspec validate [change] --strict

# Debug delta parsing
openspec show [change] --json | jq '.deltas'

# Check specific requirement
openspec show [spec] --json -r 1
```

## Happy Path Script

```bash
# 1) Explore current state
openspec spec list --long
openspec list
# Optional full-text search:
# rg -n "Requirement:|Scenario:" openspec/specs
# rg -n "^#|Requirement:" openspec/changes

# 2) Choose change id and scaffold
CHANGE=add-two-factor-auth
mkdir -p openspec/changes/$CHANGE/{specs/auth}
printf "# Change: <Concise change name>\n\n## Why\n- Problem statement: <...>\n- Evidence: <...>\n- Business impact: <...>\n\n## What Changes\n### Capability Summary\n- Scope: <...>\n- Guardrails: <...>\n\n### Technical Approach\n1. Backend:\n   - <...>\n   - <...>\n2. Frontend/Client:\n   - <...>\n   - <...>\n3. Tooling & Ops:\n   - <...>\n\n## Impact\n- Specs to update: <...>\n- Code hot spots: <...>\n- Risks: <...>\n- Stakeholders: <...>\n\n## Open Questions\n- <...>\n" > openspec/changes/$CHANGE/proposal.md
printf "## 0. Discovery & Alignment\n- [ ] 0.1 Stakeholder sync → <...>\n- [ ] 0.2 Read historical context → <...>\n- [ ] 0.3 Capture open risks → <...>\n\n## 1. Backend / API\n- [ ] 1.1 Schema change → <...>\n- [ ] 1.2 Service logic → <...>\n- [ ] 1.3 Observability → <...>\n\n## 2. Frontend / Client\n- [ ] 2.1 UX update → <...>\n- [ ] 2.2 Data wiring → <...>\n- [ ] 2.3 Edge cases → <...>\n\n## 3. Validation\n- [ ] 3.1 Unit tests → <...>\n- [ ] 3.2 Integration/E2E → <...>\n- [ ] 3.3 Manuals → <...>\n\n## 4. Rollout & Docs\n- [ ] 4.1 Deploy plan → <...>\n- [ ] 4.2 Documentation → <...>\n- [ ] 4.3 Handoff → <...>\n" > openspec/changes/$CHANGE/tasks.md

# 3) Add deltas (example)
cat > openspec/changes/$CHANGE/specs/auth/spec.md << 'EOF'
## ADDED Requirements
### Requirement: Two-Factor Authentication
Users MUST provide a second factor during login.

#### Scenario: OTP required
- **WHEN** valid credentials are provided
- **THEN** an OTP challenge is required
EOF

# 4) Validate
openspec validate $CHANGE --strict
```

## Multi-Capability Example

```
openspec/changes/add-2fa-notify/
├── proposal.md
├── tasks.md
└── specs/
    ├── auth/
    │   └── spec.md   # ADDED: Two-Factor Authentication
    └── notifications/
        └── spec.md   # ADDED: OTP email notification
```

auth/spec.md
```markdown
## ADDED Requirements
### Requirement: Two-Factor Authentication
...
```

notifications/spec.md
```markdown
## ADDED Requirements
### Requirement: OTP Email Notification
...
```

## Best Practices

### Architecture-First Guidelines
- 必须系统性检索源代码与规格，识别过度实现/过度设计，并以最优架构为唯一评判标准做决策。
- 必须优先复用现有模块、函数、类；如存在功能重叠，必须合并而非并存。
- 禁止为保持向后兼容而导致新功能/新函数不可生效；如两者冲突，必须优先新能力并移除兼容层。
- 属于破坏性变更的内容，必须直接落实删除或替换；不得保留兼容分支或折中实现。
- 修改规格时，必须直接在对应 specs 文件中更新最终状态；不得在文档中添加对原规格的评价或“退役/废弃/删除”等标志。
- 进行规格修改前，必须阅读并遵循 `cwd/openspec/AGENTS.md` 的流程与格式要求。
- 禁止伪造或假定不存在的模块、库或外部依赖。

### Clear and Specific References
All work must be specific, referencing code artifacts precisely. Vague descriptions lead to incorrect implementations.
- **Code:** Use file paths and line numbers (e.g., `src/core/config.ts:42`). When discussing functions or APIs, include their signatures (e.g., `function calculateTotal(price: number, quantity: number): number`).
- **Specs:** Reference specs by their full path (e.g., `specs/auth/spec.md`).
- **Related Work:** Link to related changes and pull requests to provide full context.

### Capability Naming
- Use verb-noun: `user-auth`, `payment-capture`
- Single purpose per capability
- 10-minute understandability rule
- Split if description needs "AND"

### Change ID Naming
- Use kebab-case, short and descriptive: `add-two-factor-auth`
- Prefer verb-led prefixes: `add-`, `update-`, `remove-`, `refactor-`
- Ensure uniqueness; if taken, append `-2`, `-3`, etc.

## Tool Selection Guide

| Task | Tool | Why |
|------|------|-----|
| Find files by pattern | Glob | Fast pattern matching |
| Search code content | Grep | Optimized regex search |
| Read specific files | Read | Direct file access |
| Explore unknown scope | Task | Multi-step investigation |

## Error Recovery

### Change Conflicts
1. Run `openspec list` to see active changes
2. Check for overlapping specs
3. Coordinate with change owners
4. Consider combining proposals

### Validation Failures
1. Run with `--strict` flag
2. Check JSON output for details
3. Verify spec file format
4. Ensure scenarios properly formatted

### Missing Context
1. Read project.md first
2. Check related specs
3. Review recent archives
4. Ask for clarification

## Quick Reference

### Stage Indicators
- `changes/` - Proposed, not yet built
- `specs/` - Built and deployed
- `archive/` - Completed changes

### File Purposes
- `proposal.md` - Why and what
- `tasks.md` - Implementation steps
- `design.md` - Technical decisions
- `spec.md` - Requirements and behavior

### CLI Essentials
```bash
openspec list              # What's in progress?
openspec show [item]       # View details
openspec validate --strict # Is it correct?
openspec archive <change-id> [--yes|-y]  # Mark complete (add --yes for automation)
```

Remember: Specs are truth. Changes are proposals. Keep them in sync.
