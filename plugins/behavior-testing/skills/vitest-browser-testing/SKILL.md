---
name: vitest-browser-testing
description: Use when writing, reviewing, or refactoring tests that run in Vitest Browser Mode, especially tests using page, userEvent, expect.element, browser locators, polling assertions, or real DOM interactions.
---

# Vitest Browser Testing

Use this skill for browser-mode tests that should assert public behavior through real DOM queries and user interactions.

## Required References

Before writing or reviewing Vitest Browser tests, read:

- `references/behavior-testing.md`
- `references/vitest-browser-testing.md`

## Workflow

1. Match the local project's Vitest Browser import style and render helper.
2. Query through `page` by role, label, text, value, or placeholder before using test IDs.
3. Drive behavior through `userEvent` or public browser interactions.
4. Assert DOM state with `await expect.element(...)` and async side effects with `expect.poll(...)`.
5. Reject selectors, classes, SVG internals, and internal data attributes unless they are documented public contracts.
