# Token Optimizer
Analyze and optimize Claude Code configuration files for token efficiency using validated techniques.

## Usage
`/optimize-tokens [scope]` where scope is:
- `full` (default) — Analyze entire `.claude/` directory, root `CLAUDE.md`, and `.claudeignore`
- `claude-md` — Audit `CLAUDE.md` files for deduplication, compression, and path-scoping opportunities
- `commands` — Review `.claude/commands/` for overlap and consolidation
- `hooks` — Examine `.claude/settings.json` hooks for output verbosity and unnecessary firing scope
- `mcp` — Audit MCP server token cost and identify inactive or deferrable tools
- `analysis` — Report all optimization opportunities without making any changes

## What it does

### 1. CLAUDE.md deduplication
Finds semantically overlapping rules (similarity ~0.87+) and proposes merged versions. Since `CLAUDE.md` is loaded on every session, every token saved here multiplies across all future sessions.

### 2. Path-scoped rules migration *(highest ROI)*
Identifies rules in `CLAUDE.md` that only apply to specific file types or directories (e.g. test conventions, API patterns, migration standards). Recommends moving them to `.claude/rules/` with a `paths:` pattern so they only load when Claude actually reads a matching file — not on every session.

**Example:** A rule like "All API routes use tRPC" only matters when editing `src/api/**`. Moving it to `.claude/rules/api-conventions.md` with `paths: ["src/api/**"]` removes it from session startup entirely and auto-injects it only when relevant.

### 3. Skill vs. CLAUDE.md routing
Suggests moving workflow-specific instructions from `CLAUDE.md` into `.claude/commands/` or skills. Commands and skills load only when invoked; `CLAUDE.md` loads always. The rule of thumb: if an instruction is only relevant to some sessions, it doesn't belong in `CLAUDE.md`.

### 4. Instruction compression
Rewrites verbose rules into tighter equivalents with the same meaning. Measures token delta before and after.

### 5. Inheritance deduplication
Checks for rules duplicated across `~/.claude/CLAUDE.md` (global) and the project-level `CLAUDE.md`. Global rules already apply to every project — repeating them in the project file wastes tokens on every session.

### 6. Hook output audit
Checks hooks in `.claude/settings.json` for two cost patterns:
- **Overly broad matchers** — a hook matching `Write|Edit` fires on every file edit in a session. This adds hook output tokens to the context on every single tool call. Narrows matchers to only the files that actually need the hook (e.g. `CLAUDE.md|settings.json`).
- **Verbose `additionalContext` output** — hook output injected via `additionalContext` enters Claude's context without truncation and persists for the rest of the session. Flags hooks whose output exceeds ~200 tokens and suggests trimming.

> Note: Hooks are not free alternatives to `CLAUDE.md` rules. Hook output adds tokens on every firing event. The benefit of hooks is **reliability and determinism** — they reduce costly correction loops. Move a rule to a hook when you need it enforced automatically, not primarily to save tokens.

### 7. `.claudeignore` audit
Checks whether a `.claudeignore` file exists and, if so, whether it covers common high-token directories (`node_modules`, `dist`, `build`, `.git`, lockfiles, generated files). Files without a `.claudeignore` are flagged because every file Claude reads in an unignored directory adds directly to context.

### 8. MCP server audit
Lists connected MCP servers, their approximate token footprint (tool schema size × number of tools), and flags any that appear inactive in recent sessions. Deferred tools are cheaper — recommends enabling `ENABLE_TOOL_SEARCH=auto` for large MCP tool sets so full schemas load on-demand rather than at startup.

---

## Output format

### Issues found
Each issue includes:
- **ROI**: `high` / `medium` / `low`
- **Location**: exact file and line range
- **Description**: what the problem is
- **Estimated savings**: tokens recoverable per session

### Suggested merges
For duplicated or overlapping rules: shows the original pair and a proposed merged version.

### Migration recommendations
A prioritized list of rules to move, including:
- Source location (current `CLAUDE.md` line)
- Target location (`.claude/rules/filename.md` with suggested `paths:` pattern, or skill/command name)
- Token savings per session

### Estimated total savings
Percentage of current session-startup token cost that could be recovered by applying all recommendations.

---

## ROI priority order

1. **Path-scoped rules migration** — removes tokens from every session, loads only when relevant
2. **CLAUDE.md deduplication + compression** — reduces fixed startup cost per session
3. **.claudeignore gaps** — prevents unbounded file-read token spikes
4. **Inheritance deduplication** — removes redundant global/project overlap
5. **MCP server audit** — defers or removes schema tokens at startup
6. **Hook output trimming** — reduces per-firing context injection
7. **Commands consolidation** — reduces overlap in manually-invoked workflows

---

## Implementation note

The PostToolUse hook integration fires **only when `CLAUDE.md` or `settings.json` are modified** — not on all file edits. This keeps the hook's own token cost minimal.

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "CLAUDE\\.md|settings\\.json",
      "hooks": [
        {
          "type": "command",
          "command": "echo '{\"additionalContext\": \"CLAUDE.md or settings.json modified — consider running /optimize-tokens to check for new savings.\"}'"
        }
      ]
    }
  ]
}
```

For a full analysis at any time, run `/optimize-tokens full`.

$ARGUMENTS (optional — pass specific files or paths to scope the analysis)