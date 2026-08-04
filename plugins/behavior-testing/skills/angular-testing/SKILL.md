---
name: angular-testing
description: Use when writing, reviewing, or refactoring Angular tests for application behavior, services, routes, state, forms, pipes, or integration flows, especially when tests may assert implementation details instead of public outcomes.
---

# Angular Testing

Use this skill for Angular tests that are not specifically component-surface tests. Tests should survive refactors to services, routes, state, signals, templates, or dependency wiring when public behavior is unchanged.

## Required Reference

Before writing or reviewing Angular tests, read `references/behavior-testing.md`.
If the suite uses Vitest Browser Mode, also read `references/vitest-browser-testing.md`.

## Angular-Specific Workflow

1. Identify the user-visible workflow, service contract, route behavior, form behavior, pipe output, or public state transition under test.
2. Drive behavior through public APIs, dependency boundaries, forms, routes, or user interactions.
3. Mock external systems at boundaries, not Angular internals or the unit under test when behavior can be exercised directly.
4. Prefer public outcomes over direct fixture state or implementation-specific dependency graph assertions.

## Angular-Specific Rejections

In addition to the shared reference, reject:

- Private fields, internal signals, private methods, directive instances, or `fixture.componentInstance` when public behavior can prove the same contract.
- Test-only diagnostic probes that expose implementation shape instead of behavior.
- Angular DI, change-detection, router, or signal internals when visible output, emitted values, service results, or form state can prove behavior.

## Self-Review Grep

Run this against changed Angular test files and justify or rewrite every hit:

```shell
rg -n "fixture\\.componentInstance|querySelector|childNodes|data-.*part|data-state|toHaveClass|\\\"set\\\" in|typeof .*\\.set|signalType|getByTestId|ɵ" <test-files>
```

Acceptable hits are documented public contracts, test-owned public hooks, or cases where no stable public surface exists and the test name states that scope.
