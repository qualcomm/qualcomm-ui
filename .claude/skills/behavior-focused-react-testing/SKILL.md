---
name: behavior-focused-react-testing
description: Use when writing, reviewing, or refactoring React component tests that must validate public behavior instead of implementation details, especially tests in packages/frameworks/react.
allowed-tools: Read Edit Write Glob Grep Bash Agent
---

# Behavior-Focused React Testing

Use this skill to keep React component tests tied to user-observable behavior and public contracts. The goal is refactor-resistant tests: internal markup, child components, styling, or state-machine plumbing can change without breaking tests for unchanged behavior.

## Required Context

For `@qualcomm-ui/react`, load only the references needed for the task:

- `references/environment-and-commands.md`: imports, Vitest browser mode, render helpers, runner commands.
- `references/querying.md`: accessible queries, query priority, acceptable `getByTestId` use.
- `references/asserting.md`: public outcome assertions and callback/form assertions.
- `references/multi-api-patterns.md`: composite/simple API parity with `MultiComponentTestCase`.
- `references/interaction-patterns.md`: click, type/fill, keyboard, portal, focus, outside interaction behavior.
- `references/state-and-callbacks.md`: controlled state, context/render-prop readouts, callback payloads.
- `references/anti-patterns.md`: implementation-detail smells and rewrite guidance.
- `references/coverage-checklist.md`: behavior coverage checklist for new or revised suites.

For other React projects, use the workflow here and adapt imports, render helpers, and runner commands to the local test stack.

## Core Rule

Before adding an assertion, ask:

> Would this still pass if the component were rewritten with different internal markup but the same public behavior?

If the answer is no, rewrite the test around a user-visible result or a documented public contract.

## Workflow

1. Identify the public surface: props, events, states, accessibility contract, user interactions, form behavior, and API variants that should behave the same way.
2. Map behaviors before assertions. Cover visible results, callback payloads, controlled/uncontrolled state, disabled/read-only no-ops, keyboard behavior, portals, focus, and edge constraints when applicable.
3. Query like a user first: role/name, label, visible text, value, placeholder. Use test IDs only for test-owned public hooks, public part-forwarding tests, or elements with no accessible surface.
4. Assert public outcomes: visible or absent content, accessible names/descriptions, focus, checked/selected state, values, ARIA state when it is the accessible contract, callback arguments, and submitted form data.
5. For multi-API components, run the same behavior assertions against every public API variant.
6. Before finishing, search changed tests for brittle selectors or implementation-detail assertions. Rewrite hits unless they are documented public contracts or test-owned public hooks.

## Review Output

When reviewing tests, lead with actionable findings:

```text
Findings
- [P1] <test asserts an implementation detail>. <file:line>
  <why it is brittle and what public behavior to assert instead>

Missing Behavior
- `<observable behavior not covered>`

Residual Risk
- `<tests not run, local limits, or behavior that lacks a stable public surface>`
```

When writing tests, include the test files changed and the command used to run them.
