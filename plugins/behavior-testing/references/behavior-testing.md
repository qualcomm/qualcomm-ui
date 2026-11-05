# Behavior Testing

Use this reference for tests that must stay tied to public behavior instead of implementation details.

## Core Rule

Before adding or approving an assertion, ask:

> Would this still pass if the implementation changed but the same public behavior remained?

If not, rewrite the test around a user-visible result, accessibility contract, callback/output payload, form value, DOM state, or documented public API.

## Shared Workflow

1. Identify the public surface: inputs/props, outputs/events, state, accessibility contract, user interactions, form behavior, and public API variants.
2. Query like a user first: role/name, label, visible text, value, placeholder. Use test IDs only for test-owned public hooks or inaccessible public parts.
3. Drive behavior through public inputs and real interactions, not direct internal state mutation.
4. Assert public outcomes: visible or absent content, accessible names/descriptions, focus, checked/selected state, values, ARIA state when it is the accessibility contract, callback/output payloads, and submitted form data.
5. Search changed tests for brittle patterns before finishing. Rewrite every hit that is not a documented contract or test-owned public hook.

## Implementation Detail Firewall

Reject assertions on:

- Private DOM shape: `querySelector`, `childNodes`, wrapper nesting, exact child order, or element tag names.
- Internal anatomy attributes such as `data-*-part`, `data-state`, `data-size`, `data-value`, or `data-from`, unless documented as public.
- Visual internals: `getBoundingClientRect`, computed dimensions, SVG `viewBox`, icon path data, CSS class names, or styling tokens.
- Child component internals used to prove parent behavior.
- Generated IDs, framework internals, private fields, private methods, or callback/output calls not caused by public user input.

## Review Output

When reviewing tests, lead with actionable findings and file/line references:

```text
Findings
- [P1] <test asserts an implementation detail>. <file:line>
  <why it is brittle and what public behavior to assert instead>

Missing Behavior
- <observable behavior not covered>

Residual Risk
- <tests not run, local limits, or behavior that lacks a stable public surface>
```

When writing tests, list changed test files and the command used to run them.
