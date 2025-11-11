# Logs Tooling & LLM Review SOP

目的：提供统一的日志结构、查看命令与固定的 LLM 检视流程，既保证覆盖面，又控制上下文体量。

## Log schema (JSON Lines)
- ts: ISO8601
- level: debug|info|warn|error
- component: string
- func: string
- event: string
- status: start|success|fail|boundary
- change_id: string
- request_id: string
- duration_ms: number
- error_code: string (required when fail)
- sample_rate: number (0-1)

约束：一行一条（no multiline）；异常堆栈以 stack_id 引用，详细另存。

## File layout
- logs/app-YYYYMMDD.jsonl: 按天切分
- logs/index.json: 计数与窗口摘要（component/func/error_code 分布、时间窗口）
- artifacts/<id>/logs/*.txt: 汇总与片段归档

## Suggested scripts (package.json)
```json
{
  "scripts": {
    "logs:summary": "node tools/logs/summary.mjs",
    "logs:errors": "node tools/logs/errors.mjs",
    "logs:view": "node tools/logs/view.mjs"
  }
}
```

## Tools API contracts (language-agnostic)
- logs:summary
  - args: --since <15m|1h|1d> --limit <50000> --top <20>
  - output: JSON with totals and topK by component/func/error_code
- logs:errors
  - args: --since <15m> --top <20>
  - output: JSON lines of top errors with counts and examples
- logs:view
  - args: --component <c> [--func <f>] [--error_code <E_*>] --since <15m> --limit <1000>
  - output: compact JSON Lines (truncate fields > 200 chars)

## CLI examples
```bash
npm run logs:summary -- --since 1h --top 20 > artifacts/<id>/logs/summary.json
npm run logs:errors -- --since 1h --top 20 > artifacts/<id>/logs/top-errors.json
npm run logs:view -- --component core --since 15m --limit 800 \
  > artifacts/<id>/logs/core-15m.jsonl
```

## Sample JSONL (copy/paste)
```jsonl
{"ts":"2025-11-11T08:00:00Z","level":"info","component":"core","func":"init","event":"start","status":"start","request_id":"r1","change_id":"demo","sample_rate":1}
{"ts":"2025-11-11T08:00:01Z","level":"info","component":"core","func":"init","event":"finish","status":"success","duration_ms":950,"request_id":"r1","change_id":"demo"}
{"ts":"2025-11-11T08:05:00Z","level":"error","component":"api","func":"fetchUser","event":"call","status":"fail","error_code":"E_UPSTREAM","request_id":"r2","change_id":"demo"}
```

## Cleanup & retention
```bash
# 删除早于14天或超限的日志（支持 --dry-run）
npm run -s logs:prune -- --keep-days 14 --max-mb 1024 --dry-run
npm run -s logs:prune -- --keep-days 14 --max-mb 1024

# 将早于30天的日志压缩为 .jsonl.gz（支持 --dry-run）
npm run -s logs:compact -- --older-than 30 --dry-run
npm run -s logs:compact -- --older-than 30
```

## Quick validation
```bash
# 1) seed sample logs (adjust date to today)
mkdir -p logs artifacts/demo/logs
cat >> logs/app-20251111.jsonl <<'EOF'
{"ts":"2025-11-11T08:00:00Z","level":"info","component":"core","func":"init","event":"start","status":"start","request_id":"r1","change_id":"demo","sample_rate":1}
{"ts":"2025-11-11T08:00:01Z","level":"info","component":"core","func":"init","event":"finish","status":"success","duration_ms":950,"request_id":"r1","change_id":"demo"}
{"ts":"2025-11-11T08:05:00Z","level":"error","component":"api","func":"fetchUser","event":"call","status":"fail","error_code":"E_UPSTREAM","request_id":"r2","change_id":"demo"}
EOF

# 2) run tools
npm run -s logs:summary -- --since 1d > artifacts/demo/logs/summary.json
npm run -s logs:errors  -- --since 1d > artifacts/demo/logs/top-errors.json
npm run -s logs:view    -- --component core --since 1d --limit 10 \
  > artifacts/demo/logs/core.jsonl

# 3) expected
# - summary.json includes core/api and E_UPSTREAM
# - top-errors.json includes api::fetchUser::E_UPSTREAM
# - core.jsonl contains 2 lines for init start/success
```

## LLM Review SOP (固定顺序)
1) 读取 summary.json（总览 + topK）
2) 读取 top-errors.json（错误热点）
3) 选择 1-2 个 component，读取 15-30 分钟窗口的 view 片段
4) 关联 change_id 与相关函数的事件流（start→success/fail）
5) 产出证据与结论，贴到 artifacts/<id>/logs/ 下

## Implementation notes
- 任何组件/函数进入/退出、失败/边界，必须落日志；fail 必含 error_code
- 约束输出体量：每次 view 限制 ≤1000 行；字段截断 200 字符
- 建议使用流式解析（逐行 JSON.parse），避免内存暴涨
- 建议用 UTC 时间与单一时区格式
