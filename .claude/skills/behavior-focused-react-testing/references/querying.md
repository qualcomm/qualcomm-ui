# Querying

Use this reference when choosing locators for React component tests.

## Query Priority

Use the strongest stable user-facing surface available:

| Prefer | Use For |
| --- | --- |
| `getByRole(..., {name})` | Buttons, dialogs, menus, tabs, options, sliders, progress bars |
| `getByLabelText` | Inputs, checkboxes, radios, switches, text areas |
| `getByText` | Visible labels, descriptions, value text, statuses |
| `getByPlaceholderText`, `getByDisplayValue` | Inputs when label or role is not the behavior under test |
| `getByTestId` | Test-owned public hooks and otherwise inaccessible public parts |

Examples from the repo:

- `button/button.spec.tsx`: `page.getByRole("button", {name: "Click Me"})`.
- `dialog/dialog.spec.tsx`: `page.getByRole("dialog", {name: labels.title})`.
- `combobox/__tests__/combobox-open-close.spec.tsx`: `page.getByRole("combobox", {name: /label/i})`.
- `checkbox/checkbox.spec.tsx`: `page.getByLabelText(demoLabel)`.

## Test IDs

Test IDs are not the default query strategy. They are acceptable for:

- Public part-forwarding tests where a composite part or simple API `*Props` receives `data-test-id`.
- Inaccessible public parts such as decorative icons, indicators, tracks, bars, positioners, or outside-click surfaces.
- Test-owned readouts added inside the test to expose context or controlled state.

Examples:

- `checkbox/checkbox.spec.tsx`: `indicatorProps`, `hiddenInputProps`, `labelProps`, `hintProps`, and `controlProps` prove part forwarding.
- `combobox/__tests__/combobox-parts.spec.tsx`: simple and composite public parts accept `data-test-id`.
- `dialog/dialog.spec.tsx`: positioner test ID is used to simulate outside interaction.
- `button/button.spec.tsx`: a caller-supplied icon gets a test-owned ID.

Avoid copying test IDs from internal component markup. Pass test IDs through public props in the test.

## Do Not Query

- Private DOM shape, wrapper nesting, exact child order, or element tag names.
- Internal anatomy attributes such as `data-*-part`.
- Child component internals to prove parent behavior.
- SVG `path`, `viewBox`, or generated icon internals.
