# Asserting

Use this reference when deciding what a behavior-focused test should assert.

## Prefer Public Outcomes

Assert what users, assistive technology, forms, or public callbacks can observe:

- Visible or absent content.
- Accessible name, description, role, and ARIA state.
- Focus, checked state, selected state, disabled state, required state.
- Input values and visible value text.
- Callback arguments caused by real user actions.
- Submitted `FormData`.

Common assertion targets in this repo:

- `toBeVisible`, `not.toBeVisible`, `toBeInTheDocument`, `not.toBeInTheDocument`.
- `toBeChecked`, `not.toBeChecked`.
- `toBeDisabled`, `not.toBeDisabled`.
- `toBeRequired`.
- `toHaveFocus`, `not.toHaveFocus`.
- `toHaveValue`.
- `toHaveAccessibleName`, `toHaveAccessibleDescription`.
- `toHaveAttribute("aria-selected", "true")`.
- `toHaveAttribute("aria-expanded", "true")`.
- `toHaveAttribute("aria-valuenow", "50")`.

## ARIA Assertions

ARIA attributes are good assertion targets when they are the accessible contract:

- Tabs: `aria-selected`.
- Menus and menu items: `aria-expanded`, `aria-checked`.
- Progress and sliders: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Invalid fields: `aria-invalid` plus visible error text.
- Descriptions: `aria-describedby` references visible hint or error text.

Do not assert generated IDs directly. It is acceptable to assert that `aria-describedby` or `aria-labelledby` references the ID of a visible hint, label, or error element created by the component.

## Callback Assertions

Trigger a public user action before asserting callback payloads:

- Click a tab before expecting `onValueChange`.
- Select a combobox option before expecting `onValueChange` or `onSelect`.
- Type into an input before expecting input-change callbacks.
- Click a switch label before expecting `onCheckedChange`.

Use `expect.poll` when browser event delivery is asynchronous.

## Avoid

- Assertions about wrapper structure, classes, SVG internals, or child component internals.
- Callback calls that were not triggered through a public input or user interaction.
- Public machine state attributes when a stronger accessible or visible assertion exists.
