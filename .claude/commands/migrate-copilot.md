# Migrate Copilot → Claude Environment

Migrate this project's GitHub Copilot configuration to Claude Code format — transforming file locations, frontmatter, and content conventions without changing project logic or intent.

## Usage
`/migrate-copilot`

No arguments needed. The command scans the project automatically.

---

## Migration Map

| Source | Destination | Notes |
|---|---|---|
| `.github/copilot-instructions.md` | `CLAUDE.md` (root) | Rewrite to Claude conventions |
| `.github/agents/` | `.claude/agents/` | Convert frontmatter to Claude agent format |
| `.github/skills/` | `.claude/skills/` | Convert frontmatter to Claude skill format |
| `.github/instructions/` | `.claude/rules/` | **Mandatory path-scoping step — see Step 5** |
| `.github/prompts/` | `.claude/commands/` | Convert GitHub Copilot prompt format to Claude command format |
| `.vscode/settings.json` | `.claude/settings.json` | Extract only Claude-relevant keys |

---

## Tool Resolution Reference

**Before converting any agent, skill, or prompt file that lists tools, apply this mapping table.** GitHub Copilot and VS Code use tool names that do not exist in Claude Code. Every tool name must be resolved to a valid Claude Code equivalent — or explicitly dropped with a note.

### Known Tool Mappings

| Copilot / VS Code Tool | Claude Code Equivalent | Notes |
|---|---|---|
| `github` | `WebFetch`, `Bash` (via `gh` CLI) | Use `WebFetch` for GitHub API URLs; use `Bash` with `gh` for PRs/issues |
| `vscode` | *(no equivalent — omit)* | VS Code UI actions are not available to Claude Code |
| `terminalLastCommand` | `Bash` | Claude runs terminal commands directly |
| `terminalSelection` | `Bash` | Same — Claude reads terminal output directly |
| `findTestingFrameworks` | `Bash`, `Read` | Claude discovers test frameworks by reading `package.json` / config files |
| `runCommands` | `Bash` | Direct shell execution |
| `readFile` | `Read` | Direct file reading |
| `editFile` | `Edit`, `Write` | Use `Edit` for partial changes, `Write` for full rewrites |
| `createFile` | `Write` | Direct file creation |
| `deleteFile` | `Bash` (`rm`) | Shell removal |
| `listDirectory` | `Bash` (`ls`) or `Read` | Bash for listing, Read for file contents |
| `searchWorkspace` / `search` | `Bash` (`grep`, `find`) | Shell search tools |
| `codebase` | `Bash` (`grep`, `find`), `Read` | Claude reads files and searches directly |
| `fetchWebPage` | `WebFetch` | Direct URL fetch |
| `webSearch` | `WebSearch` | Direct web search |
| `notebook` | `NotebookEdit`, `Read` | Jupyter notebook tools |
| `problems` / `diagnostics` | `Bash` (run linter/compiler) | Claude runs the tool directly and reads output |
| `usages` / `references` | `Bash` (`grep -rn`) | Grep for symbol references |
| `selectedText` | *(replace with `$ARGUMENTS` or plain instructions)* | Claude gets context from conversation |
| `selection` | *(replace with `$ARGUMENTS` or plain instructions)* | Same |
| `${input:...}` (variable syntax) | `$ARGUMENTS` | Claude slash command argument injection |
| `${file}` | *(replace with plain instruction)* | Claude reads files via Read tool |

### Resolving Unrecognized Tools

If a tool name in a source file is **not in the table above**, do the following before guessing:

1. Fetch the live Claude Code tools reference:
   ```
   WebFetch: https://docs.anthropic.com/en/docs/claude-code/cli-reference
   ```
2. Also fetch the agent and sub-agent docs for tool list context:
   ```
   WebFetch: https://docs.anthropic.com/en/docs/claude-code/sub-agents
   ```
3. Search the fetched content for the unknown tool name or a functional equivalent.
4. If a match is found, use it. If not, **omit the tool** from the converted file and add a comment in the migration report:
   ```
   ⚠️  UNMAPPED TOOL: [original-tool] in [source-file] — no Claude Code equivalent found. Dropped.
   ```

**Never invent a Claude tool name.** If it is not in this table or in the fetched docs, omit it.

---

## Execution Steps

Work through each step in order. Report what was found before acting on it. Do not skip steps.

### Step 1 — Scan

Run these checks and report findings before doing anything:

```
- Does .github/copilot-instructions.md exist?
- Does .github/agents/ exist and contain files?
- Does .github/skills/ exist and contain files?
- Does .github/instructions/ exist and contain files? (list filenames if yes)
- Does .github/prompts/ exist and contain files?
- Does .vscode/settings.json exist?
- Does a root CLAUDE.md already exist?
- Does .claude/settings.json already exist?
- Do .claude/agents/, .claude/skills/, .claude/commands/ already contain files?
```

Print a summary table: each source path, whether it was found, and the planned destination.

**If `.github/instructions/` exists**, collect path patterns from the user NOW before proceeding to any other step — see Step 5 for the prompt. Gathering this upfront prevents blocking mid-migration.

---

### Step 2 — copilot-instructions.md → CLAUDE.md

If `.github/copilot-instructions.md` exists:

1. Read the file.
2. If `CLAUDE.md` already exists at the root, read it too — merge intelligently, do not duplicate content.
3. Rewrite the content for Claude:
   - Remove or replace Copilot-specific language ("When Copilot generates...", "GitHub Copilot should...", etc.) with neutral or Claude-framed equivalents.
   - Preserve all project instructions, coding standards, and structural guidelines verbatim.
   - Use concise prose — Claude's CLAUDE.md is loaded on every session, so every token counts.
4. Write to `CLAUDE.md` at the project root.

---

### Step 3 — .github/agents/ → .claude/agents/

If `.github/agents/` contains files:

For each agent file:
- If a file with the same name already exists in `.claude/agents/`, read both and merge — do not overwrite.
- Otherwise convert frontmatter to Claude agent format:

```markdown
---
name: agent-name
description: One-line description of when Claude should use this agent
model: claude-sonnet-4-6   # optional — omit to inherit from project settings
tools: [Read, Edit, Bash, Write]  # optional — omit to allow all tools
---

Agent instructions here...
```

Rules:
- `name`: kebab-case, matches the filename
- `description`: written so Claude can decide when to auto-invoke this agent
- `model`: omit unless the agent genuinely needs a specific model; never hardcode a model string that could go stale — prefer omitting and letting the project setting inherit
- **Tool names: apply the Tool Resolution Reference table above to every tool listed in the source file.** Map each Copilot tool to its Claude equivalent. For any unrecognized tool, follow the doc-lookup procedure before omitting.
- Replace any Copilot-specific directives in the body (`@workspace`, `#file`, `#selection`, `#codebase`) with Claude tool references (e.g. "use the Read tool", "use Bash with grep") or remove them if no equivalent applies.
- Preserve all behavioral instructions

Write each file to `.claude/agents/[filename]`.

---

### Step 4 — .github/skills/ → .claude/skills/

If `.github/skills/` contains files or subdirectories:

For each skill:
- If the destination already exists in `.claude/skills/`, read both and merge — do not overwrite.
- Otherwise convert frontmatter to Claude skill format:

```markdown
---
description: One-line summary of when this skill applies. Used to decide relevance.
---

Skill content here...
```

Rules:
- Preserve all content exactly — only transform the frontmatter
- If a skill is a directory (e.g. `skills/vanilla-app-structure/SKILL.md`), preserve the directory structure
- If the skill body references tools by name, apply the Tool Resolution Reference table to remap them to Claude equivalents
- Remove Copilot-specific invocation syntax (`@workspace`, `#file`, `${input:...}`)

Write to `.claude/skills/[same structure]`.

---

### Step 5 — .github/instructions/ → .claude/rules/ ⚠️ MANDATORY USER INPUT

> **This step's input should have been collected in Step 1. If it was not, stop here and collect it before continuing.**

**TOKEN LEAK WARNING — path scoping is required.**

Rules files in `.claude/rules/` are injected into Claude's context on **every request** unless they declare a `paths:` pattern. Without path scoping, every rule file migrated here will consume tokens on every single Claude call — even when completely irrelevant to what you're working on.

For each file found in `.github/instructions/`, ask the user:

> `[filename]`: What file paths or directories does this rule apply to?
> Examples: `src/api/**`, `**/*.test.ts`, `src/components/**`, `**` (applies everywhere)
>
> ⚠️ Using `**` means this rule loads on every call. Only use it if the rule is truly universal to this project.

**Do not write any rules files until path patterns have been provided for every file.**

Once path patterns are confirmed, convert each file:

```markdown
---
description: One-line summary of what this rule enforces
paths:
  - "src/api/**"
  - "**/*.ts"
---

Rule content here...
```

Rules:
- Preserve all content exactly
- Remove Copilot-specific syntax
- If destination `.claude/rules/[filename].md` already exists, merge — do not overwrite
- Write to `.claude/rules/[filename].md`

---

### Step 6 — .vscode/settings.json → .claude/settings.json

If `.vscode/settings.json` exists:

1. Read the file.
2. Extract **only** keys relevant to Claude Code behavior:
   - `claude.*` — any Claude Code extension settings
   - `editor.formatOnSave`, `editor.defaultFormatter` — affects Claude's file edit behavior
   - `files.exclude`, `search.exclude` — affects what Claude can see
   - Terminal or shell settings that affect Bash tool execution
3. Ignore everything else (themes, fonts, keybindings, extension-specific UI, etc.).
4. If `.claude/settings.json` already exists, read it first and merge — do not overwrite existing Claude hooks or permissions.
5. Map extracted values to Claude's settings schema:

```json
{
  "permissions": {
    "allow": [],
    "deny": []
  },
  "hooks": {},
  "env": {},
  "includeCoAuthoredBy": true,
  "cleanupPeriodDays": 30
}
```

Only include keys that have values to set — omit empty arrays and unused keys.

6. Write the merged result to `.claude/settings.json`.

If no VS Code settings are Claude-relevant, report that and skip this step.

---

### Step 7 — .github/prompts/ → .claude/commands/

If `.github/prompts/` contains files:

GitHub Copilot prompt files use this format:
```markdown
---
mode: agent | edit | ask
description: ...
tools: [...]
---
Prompt content...
```

For each file:
- If a command with the same name already exists in `.claude/commands/`, read both and merge — do not overwrite.
- Otherwise convert to a Claude command (slash command):

```markdown
# Command Title

Brief description of what this command does and when to use it.

## Usage
`/command-name [optional-args]`

---

## Instructions

[Converted prompt content — rewritten to be imperative instructions for Claude, not a user-facing prompt template]
```

Rules:
- Filename becomes the command name (kebab-case, no `.prompt` suffix)
- `mode: agent` → Claude will use tools freely; `mode: edit` → focus on Edit/Write tools; `mode: ask` → read-only analysis
- **If the source file lists tools in frontmatter, apply the Tool Resolution Reference table** to remap each one. Only include the mapped tools in the converted output.
- Remove Copilot-specific variable syntax (`${input:...}`, `${file}`, `${selection}`) and replace with plain instructions or `$ARGUMENTS`
- Replace `#file`, `#selection`, `#codebase`, `@workspace` context references in the body with explicit Claude tool instructions (e.g. "Read the file at `$ARGUMENTS`", "use Bash grep to search the codebase")
- Write to `.claude/commands/[filename].md`

---

### Step 8 — Flag GitHub Actions

Scan `.github/workflows/` for any Copilot-specific workflows (look for: `copilot`, `github-copilot`, `copilot-autofix`, `copilot-review` in workflow file content).

For each match, report:
```
⚠️  FLAGGED: .github/workflows/[filename].yml
    Reason: Contains Copilot-specific job/step references
    Action needed: Review manually — consider replacing with the Claude Code GitHub Action
                   (uses: anthropics/claude-code-action@v1) for equivalent automation.
```

Do not modify these files.

---

### Step 9 — Migration Report

Print a final summary:

```
## Migration Complete

### Migrated
- [x] .github/copilot-instructions.md → CLAUDE.md
- [x] .github/skills/[...] → .claude/skills/[...]
- [x] ...

### Tool Remappings Applied
- github → Bash (gh CLI)  [in: .github/agents/code-reviewer.md]
- terminalLastCommand → Bash  [in: .github/agents/debug-helper.md]
- (list every remapping performed, one line each)

### Unmapped Tools Dropped
- ⚠️  vscode [in: .github/agents/foo.md] — no Claude Code equivalent, dropped from tools list
- (list any tools that had no mapping and were omitted)

### Skipped (not found)
- [ ] .github/agents/ — not present
- [ ] ...

### Flagged (manual action needed)
- ⚠️  .github/workflows/[filename].yml — review for Copilot-specific steps

### Recommended next steps
1. Run `/optimize-tokens` to check the migrated CLAUDE.md and rules files for token savings.
2. Review any unmapped tools above — you may be able to replicate the behavior with Bash commands.
3. Review flagged GitHub Actions workflows and consider migrating to the Claude Code GitHub Action.
```
