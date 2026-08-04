---
name: write-docs
description: Write or revise QUI Docs documentation. Use whenever Codex is creating, editing, restructuring, or expanding MDX route files, navigation entries, documentation links, examples, screenshots, or docs assets in packages/docs/qui-docs or any QUI Docs-based documentation site; also use when a user asks to author documentation, add a docs page, rewrite docs copy, or prepare documentation for a PR.
---

# Write Docs

Use this skill to produce QUI Docs pages that are useful before they are polished. The bundled references are the source of truth for page structure, writing style, naming, links, assets, and self-check criteria. Apply them directly.

## Required Context

Read these bundled references before making documentation changes:

- `references/principles.md`
- `references/rules.md`

These live at the root of the `qui-docs` plugin's installed directory. In Claude Code, that resolves to `${CLAUDE_PLUGIN_ROOT}/references/principles.md` and `${CLAUDE_PLUGIN_ROOT}/references/rules.md`.

If either reference is missing, stop and report that the `qui-docs` plugin is misinstalled.

## Workflow

1. Identify the page type per `references/principles.md`. Split the work if a page is trying to be more than one type.
2. Draft with reader value in the first paragraph — what the reader can do, decide, verify, or troubleshoot after reading.
3. Apply every rule in `references/rules.md` while writing. Update `qui-docs.config.ts` when route order, nesting, or visibility changes.
4. Run the Author Self-Check in `references/rules.md` before finishing. If any code snippet cannot be run or compiled, state that explicitly.
