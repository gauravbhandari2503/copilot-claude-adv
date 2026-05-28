# Claude Code Token Optimization — Validated Techniques

> 5 techniques that genuinely save tokens, adapted for Claude Code's actual directory structure: `CLAUDE.md`, commands, hooks, agents, and MCP servers. Sorted by ROI.

---

## Claude Code's Configuration Landscape

Before optimizing, know what you're working with:

```
project/
├── CLAUDE.md                  # Project-level instructions (always loaded)
├── .claude/
│   ├── settings.json          # Permissions, env, MCP config
│   ├── commands/              # Custom slash commands (/do-thing.md)
│   └── agents/                # Subagent definitions (future/experimental)
~/.claude/
├── CLAUDE.md                  # User-level instructions (always loaded)
└── settings.json              # User defaults
```

**Key insight:** `CLAUDE.md` files at project and user level are injected into every conversation. They are your biggest token surface — and your biggest optimization target.

---

## 1. Progressive Context Loading via Commands
**ROI: High — 50–80% savings**

The worst CLAUDE.md pattern: a monolithic file that dumps all rules for all tasks on every turn.

Claude Code's **custom commands** (`.claude/commands/`) are the right primitive here. Each command is a markdown file that loads only the context relevant to that task. Claude reads the command file when invoked; it's not pre-loaded.

**Before (monolithic CLAUDE.md)**
```markdown
# CLAUDE.md
## API Development Rules
...all backend rules...

## Frontend Rules
...all React rules...

## Database Rules
...all migration rules...

## Testing Rules
...all test patterns...
```

**After (lean CLAUDE.md + task-scoped commands)**
```markdown
# CLAUDE.md  (stays minimal — always loaded)
- Use TypeScript strictly
- Ask before destructive changes
- Run tests before committing
```

```markdown
# .claude/commands/api.md
Build or modify REST/GraphQL API endpoints.

## Constraints
- Validate all inputs with Zod
- Return typed responses
- Follow existing route patterns in src/routes/
- Write integration tests alongside implementation

## Examples
$ARGUMENTS  ← describe the endpoint
```

```markdown
# .claude/commands/migrate.md
Create or modify database migrations.

$ARGUMENTS  ← describe the schema change

## Constraints
- Never drop columns without a deprecation step
- Always include rollback in the same migration
- Check for FK dependencies before altering tables
```

Now `/api` and `/migrate` load exactly the context they need. Nothing bleeds across.

> **Implementation note:** `$ARGUMENTS` in a command file receives whatever the user types after the slash command. Use it to make commands generic rather than writing one-off variants.

---

## 2. Shared Instruction Inheritance via CLAUDE.md Hierarchy
**ROI: High — 20–60% savings**

Claude Code already supports a two-level CLAUDE.md hierarchy (user-level `~/.claude/CLAUDE.md` + project-level `project/CLAUDE.md`). Use it deliberately to avoid repeating baseline instructions in every project.

You can also extend this pattern within a monorepo using **subdirectory CLAUDE.md files** — Claude Code reads the nearest CLAUDE.md relative to the files it's editing.

**Before (everything repeated per project)**
```markdown
# project-a/CLAUDE.md
- Write production code
- Follow clean code principles
- Ask before destructive changes
- Use conventional commits
- TypeScript strict mode
- Project-specific: use Prisma for DB access
```

```markdown
# project-b/CLAUDE.md
- Write production code
- Follow clean code principles
- Ask before destructive changes
- Use conventional commits
- TypeScript strict mode
- Project-specific: use Drizzle for DB access
```

**After (hierarchy does the work)**
```markdown
# ~/.claude/CLAUDE.md  (user-level, applies everywhere)
- Write production code
- Follow clean code principles
- Ask before destructive changes
- Use conventional commits
- TypeScript strict mode
```

```markdown
# project-a/CLAUDE.md  (only the delta)
- Use Prisma for all DB access
- Migration files go in prisma/migrations/
```

```markdown
# project-b/CLAUDE.md  (only the delta)
- Use Drizzle for all DB access
- Schema lives in src/db/schema.ts
```

> **Monorepo pattern:** Add `packages/backend/CLAUDE.md` and `packages/frontend/CLAUDE.md` for package-specific rules. Claude reads the nearest ancestor CLAUDE.md, so subdirectory files stack on the project root without duplication.

---

## 3. Semantic Deduplication
**ROI: High — 15–30% savings**

CLAUDE.md files accumulate. Rules get added over time by different team members, often expressing the same constraint in different words. Run deduplication offline before it becomes a drag.

**Before (accumulated drift)**
```markdown
- avoid duplication in code
- don't repeat yourself
- keep the code DRY
- no copy-paste logic between modules
- extract shared logic into utilities
```

**After**
```markdown
- Follow DRY principles; extract shared logic into `src/utils/`
```

Use embedding similarity (cosine ~0.87–0.92) as a preprocessing step on your CLAUDE.md files. Lower than 0.87 and you start merging rules that are meaningfully distinct.

**Practical approach without embeddings:**
Run your CLAUDE.md through an LLM with the prompt: *"Find instructions that overlap in meaning and suggest merged versions. Flag any that are ambiguous."* Review the output, don't blindly apply it.

> **Red flag:** If your CLAUDE.md has grown past ~150 lines, it almost certainly has 30%+ deduplication opportunity. Audit it.

---

## 4. Hook-Based Guardrails (Replace Repetitive Reminders)
**ROI: Medium — removes a category of instructions entirely**

A common CLAUDE.md antipattern: instructions that remind Claude to do things it should always do anyway — format code, run lint, check types. These instructions cost tokens every turn and are often ignored.

Claude Code **hooks** (`settings.json` → `hooks`) are the right fix. Hooks run shell commands at defined lifecycle points and their output is fed back to Claude. You get enforcement, not reminders.

**Before (instruction-based, often ignored)**
```markdown
# CLAUDE.md
- Always run `npm run lint` after making changes
- Always run `tsc --noEmit` to check types before finishing
- Never commit with failing tests
- Format files with Prettier after editing
```

**After (hook-based, enforced)**
```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint --silent 2>&1 | head -20"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo '[hook] Review the command before running'"
          }
        ]
      }
    ]
  }
}
```

Now lint runs automatically after every file edit. The output appears in context only when there's something actionable. You removed four lines of CLAUDE.md and gained reliable enforcement.

> **Hooks available:** `PreToolUse`, `PostToolUse`, `Stop`, `Notification`. Matcher is a regex on tool name. Hook output feeds back into Claude's context — keep commands focused so they don't bloat it.

---

## 5. Command Templates as Prompt Macros
**ROI: Medium — variable, depends on reuse frequency**

The same principle as prompt macros in Copilot, expressed through Claude Code's native primitive: custom slash commands as reusable, parameterized prompt blocks.

This is only worthwhile for workflows you invoke 3+ times. One-off commands don't justify the file overhead.

**Before (typed out every session)**
```
Please review this PR for: security issues (input validation, auth checks, 
exposed secrets), performance concerns (N+1 queries, missing indexes, 
unnecessary re-renders), and test coverage gaps. Be specific about line 
numbers and severity.
```

**After (.claude/commands/review.md)**
```markdown
Review the specified code for production readiness.

$ARGUMENTS

## Review dimensions
1. **Security** — input validation, auth checks, exposed secrets, injection vectors
2. **Performance** — N+1 queries, missing indexes, unnecessary re-renders, large payloads  
3. **Test coverage** — happy path only, missing edge cases, untested error branches
4. **Correctness** — logic errors, off-by-one, unhandled nulls

For each finding: file path, line number, severity (critical/warning/suggestion), 
and a concrete fix.
```

Now `/review src/api/users.ts` invokes the full template every time, with zero typing overhead and consistent structure across the team.

> **Commit your `.claude/commands/` directory.** Commands defined there are available to everyone on the project. This turns prompt optimization into a shared team asset.

## The One Rule That Applies to Everything

> Never ship an optimized CLAUDE.md without testing it on representative tasks.
> Shorter context is only better if behavior is unchanged.

```
Original CLAUDE.md + task
        vs
Optimized CLAUDE.md + same task
→ compare outputs
→ accept only if behavior is unchanged
→ especially check edge cases the removed rules were guarding
```

The hooks give you a lightweight regression layer for mechanical checks. For behavioral rules, you still need human review.