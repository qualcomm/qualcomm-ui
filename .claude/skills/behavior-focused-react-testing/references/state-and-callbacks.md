# State And Callbacks

Use this reference when testing controlled state, uncontrolled state, context APIs, or callback payloads.

## Controlled And Uncontrolled State

Cover the public state surface:

- Default state from `default*` props.
- Controlled state from `value`, `checked`, `open`, or selected values.
- External updates via a test-owned button or wrapper state.
- Disabled and read-only no-op behavior.

Examples:

- `tabs/tabs.spec.tsx`: external buttons update controlled tab value.
- `switch/switch.spec.tsx`: controlled checked state updates from `onCheckedChange`.
- `text-input/text-input.spec.tsx`: controlled value updates from an outside button.
- `progress/progress.spec.tsx`: visible value and ARIA values update when state changes.

## Callback Payloads

Assert callback payloads after public actions:

- `tabs/tabs.spec.tsx`: click tab and expect selected value.
- `combobox/__tests__/combobox-callbacks.spec.tsx`: open, type, highlight, select, and assert payloads.
- `menu/menu.spec.tsx`: select an item and expect the item value.
- `switch/switch.spec.tsx`: click label and expect next checked value.
- `number-input/number-input.spec.tsx`: button click, typed input, and invalid values trigger callbacks.

Use `expect.poll` or `vi.waitFor` for async browser delivery. Prefer `expect.poll` where the surrounding tests already use it.

## Context And Render Props

Expose context or render-prop state through test-owned visible output. This verifies the public context contract without inspecting React internals.

Examples:

- `tabs/tabs.spec.tsx`: `Tabs.Context` renders `current-value` and a button that calls `api.setValue`.
- `dialog/dialog.spec.tsx`: `Dialog.Context` renders "Dialog is open" or "Dialog is closed".
- `menu/menu.spec.tsx`: context state readout changes from "closed" to "open".
- `tree/tree.spec.tsx`: API readouts expose expanded, selected, and checked state.
