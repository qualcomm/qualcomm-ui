# Anti-Patterns

Use this reference when reviewing brittle tests or deciding whether an assertion is too implementation-specific.

## Implementation Detail Smells

Flag these during review:

- `querySelector`, `childNodes`, `compareDocumentPosition`, `getBoundingClientRect`.
- Exact wrapper nesting, element tag names, child order, SVG path data, `viewBox`, or class names.
- Internal anatomy attributes such as `data-*-part`.
- Child component internals. Example: a Select test should not inspect Checkmark's internal DOM.
- Generated IDs asserted directly.
- Callback calls asserted without triggering a public user action.

## Public State Attributes

The repo contains older or lower-level tests that assert public state through `data-*` attributes. Do not copy them unless no better public surface exists.

Common examples to treat carefully:

- `data-state` for checked, indeterminate, open/closed, complete/loading.
- `data-focus` and `data-highlighted` for roving focus or active descendant behavior.
- `data-disabled` and `data-invalid` for public state attributes.

Preferred alternatives:

- Checked state: `toBeChecked` or `aria-checked`.
- Selected tab: `aria-selected`.
- Open/closed: visible content or absent content.
- Focus: `toHaveFocus`.
- Slider/progress value: `aria-valuenow`, visible value text.
- Disabled: `toBeDisabled` when the element is actually disabled.
- Invalid: `aria-invalid` plus visible error text.
- Highlighted item: callback payload such as `onHighlightChange`, or an accessible active-descendant contract if present.

When a `data-*` assertion remains, justify it as part of the component's public styling/state contract or because no accessible surface exists.

## Known Existing Tests To Improve If Touched

- `select/select.spec.tsx` and `combobox/__tests__/combobox-misc.spec.tsx` contain `querySelector("[data-test-id='qui-icon']")` checks. Prefer a public icon prop, accessible image role/name, visible text stand-in, or a lower-level icon test.
- Some tests assert `toHaveClass` for prop forwarding. Prefer visible behavior or a test-owned public prop unless class forwarding is the contract under test.

## Self-Review Grep

Before finishing a test change, run:

```shell
rg -n "querySelector|childNodes|compareDocumentPosition|getBoundingClientRect|data-state|data-focus|data-highlighted|data-disabled|data-.*part|toHaveClass|viewBox|getByTestId" <test-files>
```

Every hit should have one of these explanations:

- It is a public accessibility or behavior contract.
- It is a test-owned prop passed through the public API.
- No accessible query exists, and the test is specifically about public part forwarding.
- The assertion should be rewritten.
