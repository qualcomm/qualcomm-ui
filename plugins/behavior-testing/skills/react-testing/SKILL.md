---
name: react-testing
description: Use when writing, reviewing, or refactoring React tests for application behavior, hooks, routes, state, or integration flows, especially when tests may assert implementation details instead of public outcomes.
---

# React Testing

Use this skill for React tests that are not specifically component-surface tests. Tests should survive refactors to internal state, routing, data loading, hooks, or rendering details when public behavior is unchanged.

## Required Reference

Before writing or reviewing React tests, read `references/behavior-testing.md`.
If the suite uses Vitest Browser Mode, also read `references/vitest-browser-testing.md`.

## React-Specific Workflow

1. Identify the user-visible workflow, public hook return value, route behavior, state transition, or side effect under test.
2. Follow the local React test stack and its render/query helpers.
3. Drive behavior through public inputs, route changes, user interactions, or documented hook APIs.
4. Mock external systems at boundaries, not the unit under test or its direct collaborators when behavior can be exercised directly.

## React-Specific Rejections

In addition to the shared reference, reject:

- React state internals, reducer implementation details, context plumbing, cache keys, or hook call order when a public result can prove the contract.
- Router/library internals when route output, navigation state, URL, loader/action result, or visible error state can prove behavior.
- Child component internals used to prove an application workflow.

## Self-Review Grep

Run this against changed React test files and justify or rewrite every hit:

```shell
rg -n "querySelector|childNodes|compareDocumentPosition|getBoundingClientRect|data-state|data-focus|data-highlighted|data-disabled|data-.*part|toHaveClass|viewBox|getByTestId|useState|useReducer" <test-files>
```

Acceptable hits are test-owned public hooks, documented public contracts, or inaccessible public parts where no accessible query exists.
