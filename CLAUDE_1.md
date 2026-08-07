# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Token Budgets Are Not Advisory

**Set limits. Summarize and restart before you lose the thread.**

- Per task: ~4,000 tokens. Per session: ~30,000 tokens.
- If approaching budget, summarize progress and start fresh instead of continuing to loop.
- A long debugging session stuck on the same error is a signal to stop and reset, not push harder — confidence without progress means you're lost, not thinking harder.

## 6. Surface Conflicts, Don't Average Them

**When two patterns disagree, pick one. Don't blend them.**

- If existing code handles something (e.g. errors) two different ways, don't merge both approaches into new code.
- Pick one — usually the newer or better-tested pattern — explain why, and flag the other as cleanup debt.
- Averaged/blended code is usually the worst code: the same problem gets handled twice and nobody knows what's actually going on.

## 7. Read Before You Write

**Understand nearby code before adding to it.**

- Before adding new code, check the file's exports, where similar code is already called from, and any obvious shared utilities.
- "Looks unrelated" is not good enough — verify there isn't already a function or pattern doing the same job.
- Watch for creating a duplicate that silently wins over the trusted original just because of import order.

## 8. Use the Model Only for Judgment Calls

**Code should answer what code can answer.**

- Use Claude for classification, drafting, summarizing, extraction, and genuine judgment calls.
- Don't use Claude for routing, retries, status codes, or anything that should follow a fixed rule.
- If a 503 already tells you to retry, don't ask a language model for its opinion — that's like asking a poet to operate a traffic light.

## 9. Tests Verify Intent, Not Just Behavior

**A test that can't fail when the logic breaks isn't a real test.**

- Tests must check that a function returns the *right* thing per the actual business logic — not just that it returns *something*.
- Be suspicious of tests that would still pass if the implementation were replaced with a stub that always returns the same value.
- A test that can't fail is decoration, not verification.

## 10. Checkpoint After Every Significant Step

**Summarize before continuing. If you can't explain the state, stop.**

- After each significant step, state three things: what was done, what was verified, and what's still left.
- Don't build step 5 on top of a broken step 4 — checkpoint and confirm before moving forward.
- If the current state can't be explained back clearly, that's the signal to stop, not continue.

## 11. Match the Codebase's Conventions, Even If You Disagree

**Consistency beats better taste.**

- Match existing naming, patterns, and structure (snake_case vs. camelCase, class components vs. hooks, file layout, etc.), even inside a codebase with a "weird" structure.
- Claude can say a convention seems bad — but it doesn't quietly deviate and introduce its own style anyway.

## 12. Fail Loud

**"Done" is wrong if anything was skipped silently.**

- "Completed" is wrong if anything was skipped silently. "Tests pass" is wrong if any tests were skipped. "Feature works" is wrong if an edge case wasn't checked.
- Surface uncertainty by default — don't bury a skip or caveat in the logs and move on.
- "I couldn't verify this" is always better than a confident "it works" that turns out to be false.

---

## When Extending This File

- Keep the whole file under ~200 lines. Beyond that, compliance drops sharply because important rules get buried — split task-specific workflows into skills or separate docs instead.
- Prefer rules over examples. Examples are token-expensive and get copied too literally; general rules generalize better.
- Avoid vague instructions like "be careful" or "think hard" — they're not testable and get ignored. Write specific, checkable rules instead (e.g. "state assumptions explicitly").
- Avoid rules that assume a specific tool is installed (e.g. "always use ESLint") — word them around the outcome instead (e.g. "match the codebase's enforced style") so they don't silently break.
- Don't tell Claude to "be a senior engineer" — it already assumes that. The gap is behavior, not confidence, and only concrete rules close it.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
