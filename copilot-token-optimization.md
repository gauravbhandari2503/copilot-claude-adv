# Copilot Token Optimization — Validated Techniques

> 5 techniques that genuinely save tokens, sorted by ROI. 2 from the original list removed due to reliability tradeoffs.

---

## 1. Progressive Context Loading
**ROI: High — 50–80% savings**

Load only what the current task needs. Most token waste comes from including all agents, all skills, and all examples on every turn regardless of relevance.

**Before**
```
load:
  - all_skills
  - all_agents
  - all_examples
```

**After**
```yaml
task: create_api
load:
  - coding_rules
  - backend_skill
  - api_templates
```

> **Implementation note:** You need a fast tag/keyword index to resolve `task → skill set` at prompt-build time. Even a simple YAML manifest keyed by task type works. This runs in your tooling, not inside the prompt.

---

## 2. Shared Instruction Inheritance
**ROI: High — 20–60% savings**

Extract instructions repeated across multiple agents into a shared base. Resolve the inheritance at build time so the LLM only ever sees the final merged prompt.

**Before**
```
Agent A:
  - Write production code
  - Follow clean code principles
  - Ask before destructive changes

Agent B:
  - Write production code
  - Follow clean code principles
  - Prefer maintainable solutions
```

**After (build-time resolved)**
```
# shared_base.md
  - Write production code
  - Follow clean code principles

# Agent A (final prompt sent to model)
  [shared_base resolved here]
  - Ask before destructive changes

# Agent B (final prompt sent to model)
  [shared_base resolved here]
  - Prefer maintainable solutions
```

> **Critical:** Never send `inherit(shared_base)` literally to the model. It must be resolved by your prompt assembly layer before the API call. The model does not understand inheritance syntax.

---

## 3. Semantic Deduplication
**ROI: High — 15–30% savings**

Use embedding similarity to find and merge instructions that mean the same thing. Run this as a preprocessing step on your instruction files, not at runtime.

**Before**
```
"avoid duplication"
"don't repeat code"
"keep code DRY"
"no copy-paste logic"
```

**After**
```
"Follow DRY principles"
```

> **Threshold:** Use cosine similarity of 0.87–0.92. Below 0.87 you start merging instructions that are meaningfully distinct. Run this offline and review merged output before committing.

---

## 4. Dead Instruction Detection + CI Pipeline
**ROI: Medium — removes ~30% of instructions in mature codebases**

Track which instructions actually influence outputs. Remove ones that never change model behavior. Enforce this with a lint step in your CI pipeline.

```
instructions/ → lint → deduplicate → normalize
             → token count → validate against golden outputs
             → publish to optimized/
```

**Typical findings in a mature codebase:**
- ~30% dead instructions
- ~20% duplicated guidance
- ~10% obsolete rules

> **Note:** The pipeline is also your safety net. Always regression-test optimized prompts against a golden output set before deploying. This is not optional.

---

## 5. Prompt Macros (Build-Time Templates)
**ROI: Medium — variable, depends on reuse frequency**

Reference large, stable prompt blocks by a short token. Resolve them before the API call. Only worthwhile for blocks used 3+ times — one-off references do not justify the tooling overhead.

**Before (repeated across 8 agents)**
```
Security rules:
  - validate all input
  - sanitize output
  - enforce least privilege
  - log auth failures
  - never expose stack traces
```

**After (in each agent prompt file)**
```
{{security_v3}}
```

> **Same rule as inheritance:** `{{security_v3}}` must be replaced with its full contents before the prompt reaches the model. This is template substitution in your build pipeline, not something the LLM resolves.

---

## Removed from Original List

These two techniques were cut due to reliability tradeoffs that outweigh their token savings.

### ❌ Natural Language → YAML Config
Saves only 5–8 tokens per instruction block — negligible at scale. More importantly, prose instructions are followed more reliably than structured config because models are trained heavily on natural language. Trading instruction fidelity for trivial token savings is not worth it.

### ❌ Compile to IR / JSON
Works fine for structured metadata (`role`, `mode`, `checks`). Unreliable for behavioral rules. Anything describing *how the model should behave* loses nuance when compressed to `"style":"concise"`. The model must re-expand it at inference time, and that expansion is not deterministic or guaranteed to be faithful.

---

## The One Rule That Applies to Everything

> Never ship an optimized prompt without regression testing it against a golden output set.
> Token count going down while behavior drifts silently is worse than doing nothing.

```
Original prompt
    vs
Optimized prompt
→ same task
→ compare outputs
→ accept only if behavior is unchanged
```