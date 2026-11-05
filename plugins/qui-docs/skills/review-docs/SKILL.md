---
name: review-docs
description: Review QUI Docs documentation for authoring compliance. Use whenever Codex is reviewing, proofreading, auditing, final-checking, or preparing to submit MDX route files, navigation entries, documentation links, examples, screenshots, or docs assets in packages/docs/qui-docs or any QUI Docs-based documentation site; also use as the final quality pass after writing or revising QUI Docs documentation.
---

# Review Docs

Use this skill to review documentation changes as a docs reviewer. The bundled references are the source of truth for what to check. Cite them in findings — do not paraphrase or substitute.

## Required Context

Read these bundled references before reviewing documentation changes:

- `references/principles.md`
- `references/rules.md`

These live at the root of the `qui-docs` plugin's installed directory. In Claude Code, that resolves to `${CLAUDE_PLUGIN_ROOT}/references/principles.md` and `${CLAUDE_PLUGIN_ROOT}/references/rules.md`.

If either reference is missing, stop and report that the `qui-docs` plugin is misinstalled.

## Review Workflow

1. List the files under review: MDX route files, `qui-docs.config.ts`, links, examples, screenshots, and asset folders.
2. For each page, determine its intended page type per `references/principles.md`. Flag pages that mix unrelated types.
3. Check every Reviewer Rejection Gate in `references/rules.md`. Each match is a P1 finding.
4. Check the rest of `references/rules.md` (naming, frontmatter, headings, MDX formatting, links, navigation, assets, terminology, writing mechanics, examples, API/CLI page order, compatibility routes). Report violations as P2 unless they degrade reader usability, in which case P1.
5. Run or compile any code snippets touched by the change. If that is not feasible, list snippet verification as residual risk.

## Output

Lead with findings ordered by severity. Include file and line references for every actionable issue.

Use this shape:

```text
Findings
- [P1] <issue>. <file:line>
  <why it matters and what to change>

Open Questions
- <only if needed>

Residual Risk
- <unverified snippets, links not checked in a running dev server, or other limits>
```

If there are no issues, say that clearly and include any remaining verification gaps.
