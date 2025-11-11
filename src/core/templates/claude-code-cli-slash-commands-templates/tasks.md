# Tasks (细化到步骤与函数级)

> 将本模板复制到 `openspec/changes/<id>/tasks.md` 并按需替换尖括号占位符。
> 要求：必须详细（每一步、每个小函数需列明签名、返回类型、错误处理与测试证据）；小而可验；每项包含「输入、操作、产出、证据钩子」。
>
> 强制字段（每条任务都必须包含，缺一不可）：
> - 路径：相对路径（如 `src/<path>/<file>.ts`）
> - 函数签名：名称、参数、返回类型（如 `function f(a: A): Result<B>`）
> - 错误处理策略：抛错类型或 Result 错误码；必要时记录日志键
> - 测试用例：至少 2 个（成功分支、异常/边界分支），列出用例名
> - 输入｜操作｜产出：一行归纳，操作细化 1–3 步
> - 证据钩子：命令/截图/日志/最小 diff 的保存路径
> - 边界与失败模式：列出至少 2 条并说明处理方式
> - 验收标准/成功信号：可被验证的量化或可复现实验输出

> 日志打点与 LLM 查看流程（强制）：
> - 日志键与结构：`ts` 时间戳、`level`、`component`、`func`、`event`、`status`、`change_id`、`request_id`、`duration_ms`、`error_code`（异常时必填）、`sample_rate`
> - 输出格式：JSON Lines（.jsonl），每条一行；禁止多行堆栈（改写为单行摘要+stack_id）
> - 覆盖面：每个入口函数“开始/结束/耗时”，每个核心函数“成功/失败/边界”；错误必含 `error_code`
> - 存储与切分：`logs/app-YYYYMMDD.jsonl` 按天切分；超阈值滚动；生成 `logs/index.json`（计数/窗口摘要）
> - 查看工具与流程（项目应提供脚本或等价命令；详见 @openspec/logs/logs-tooling.md 模板）：
>   1) `logs:summary` → 统计按 component/func/error_code 分布
>   2) `logs:errors` → 最近 N 分钟错误 Top-K
>   3) `logs:view --component <c> --since <t>` → 聚焦窗口
>   4) 将摘要/片段归档到 `artifacts/<id>/logs/*.txt`
> - LLM 检查时序（固定）：Summary → Top errors → Focused window → Correlate with change_id → Evidence

## 0. Discovery & Alignment
- [ ] 0.1 研读上下文 → 打开 `openspec/changes/<id>/proposal.md` 与相关 `specs/*/spec.md`
- [ ] 0.2 代码定位 → 列出受影响文件/模块（相对路径），标注导出项/入口函数
- [ ] 0.3 风险记录 → 在 proposal.md 的「风险与缓解」补充新增发现

## 1. Implementation
- [ ] 1.1 核心函数实现 → `src/<path>/<file>.ts`
      输入：<变量/类型>；操作：实现纯函数/副作用隔离；产出：<返回类型>
      函数签名：
      ```ts
      export function <name>(a: TypeA, b: TypeB, opts?: Options): Result<Out>
      ```
      要点：
      - <规则 1>
      - <规则 2>
      错误处理：抛出 `DomainError` 或返回 `Result.err(code)`；日志键：`<key>`

- [ ] 1.2 辅助函数 → `src/<path>/<file>.ts`
      输入：<X>；操作：<缓存/重试/节流>；产出：<Y>
      签名：
      ```ts
      export async function <helper>(input: X): Promise<Y>
      ```
      边界：<空值/超时/格式不符>；降级：<默认值/后备路径>

- [ ] 1.3 接线改动（调用点）→ `src/<path>/<component>.tsx`
      步骤：
      1) 注入依赖（<provider/hook>）
      2) 调用 `/<name>` 并处理 loading/error
      3) 渲染成功态；为空态与错误态提供文案

- [ ] 1.4 配置/常量 → `src/<path>/config.ts`
      新增：`<FLAG_NAME>`（默认关闭）；文档：`README` 中“配置项”

## 2. Validation
- [ ] 2.1 单元测试 → `test/<path>/<file>.test.ts`
      用例：
      - <case-1> 覆盖成功分支（断言纯函数输出）
      - <case-2> 覆盖异常/边界（断言错误/降级路径）

- [ ] 2.2 集成/E2E → `test/e2e/<flow>.spec.ts`
      场景：<用户流/CLI 命令>；断言：<可见 UI/标准输出/副作用>

- [ ] 2.3 证据归档 → `artifacts/<id>/`
      - 运行命令：`npm test -- <suite>`、`openspec validate "<id>" --strict`
      - 存放：关键日志、截图、命令输出（txt）与最小 diff 片段

---

### 任务条目模板（复制用，强制字段示例）
- [ ] <序号> <简洁任务名> → `src/<path>/<file>.ts`
      路径：`src/<path>/<file>.ts`
      函数签名：`export function <name>(a: A, b: B): Result<C>`
      错误处理：抛出 `DomainError` ｜ 返回 `Result.err('E_CODE')`（日志键：`<key>`）
      输入｜操作｜产出：<input>｜1) <step-1> 2) <step-2>｜<output>
      测试：`test/<path>/<file>.test.ts`（`<case-success>`、`<case-error>`）
      边界与失败：<boundary-1>；<boundary-2>
      证据钩子：`artifacts/<id>/<step>.txt|.png|.diff`
      验收/成功信号：<metric/log/assertion>

### 示例任务（可删除）
- [ ] 1.1 解析配置并校验 → `src/core/config/loader.ts`
      路径：`src/core/config/loader.ts`
      函数签名：`export function loadConfig(p: string): Result<Config>`
      错误处理：`Result.err('E_CONFIG_INVALID')`（日志键：`config_invalid`）
      输入｜操作｜产出：`/path/app.json`｜1) 读取 2) 解析 3) 校验｜`Config`
      测试：`test/core/config/loader.test.ts`（`loads_valid_config`、`rejects_invalid_schema`）
      边界与失败：空文件；必填字段缺失
      证据钩子：`artifacts/<id>/load-config.txt`
      验收/成功信号：validate 通过且单测覆盖>90%
