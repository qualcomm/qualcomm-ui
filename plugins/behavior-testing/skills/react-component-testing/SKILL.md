---
name: react-component-testing
description: Use when writing, reviewing, or refactoring React component tests, especially tests for props, callbacks, controlled state, children, accessibility, form behavior, or multiple public component API variants.
---

# React Component Testing

Use this skill for React component test writing and review. Component tests should prove public component behavior, not the current DOM or child component implementation.

## Required References

Before writing or reviewing React component tests, read:

- `references/behavior-testing.md`
- `references/component-testing.md`
- `references/vitest-browser-testing.md` when the suite uses Vitest Browser Mode

## React Component Workflow

1. Identify props, callbacks, controlled/uncontrolled state, children or render props, accessibility, user interactions, forms, and public API variants.
2. Follow the local React test stack and its render/query helpers.
3. Assert callback payloads only after public user interaction.
4. Run shared behavior assertions across public API variants when those variants claim the same behavior.

## React Component Rejections

In addition to the shared references, reject:

- Child component internals. A parent test must not inspect a child's private markup to prove parent behavior.
- React state-machine plumbing, generated context internals, or render-prop internals when visible output can prove the contract.
- Icon/SVG internals such as `path`, `viewBox`, or generated icon markup. Use visible text stand-ins, accessible names, or lower-level icon tests.

## Self-Review Grep

Run this against changed React component test files and justify or rewrite every hit:

```shell
rg -n "querySelector|childNodes|compareDocumentPosition|getBoundingClientRect|data-state|data-focus|data-highlighted|data-disabled|data-.*part|toHaveClass|viewBox|getByTestId" <test-files>
```
