# Coverage Checklist

Use this reference when planning or reviewing a component test suite.

## Behavior Coverage

For a new or revised component test suite, consider:

- Rendering: role/name/label/visible text for the main affordance.
- API parity: composite and simple APIs, where both exist.
- Inputs: default state, controlled state, external updates, callbacks.
- Interactions: click, typing/fill, keyboard navigation, Escape, Home/End, Tab/focus.
- Accessibility: labels, descriptions, ARIA state/value, required/disabled/invalid/read-only.
- Hint and error behavior: hint visible when valid, error visible when invalid, hint hidden if appropriate.
- Portals and overlays: open/close, Escape, outside interaction, focus trap/restore.
- Forms: submitted `FormData`, reset behavior, hidden input values.
- Edge constraints: min/max, step, range, lazy mount/unmount, empty results, disabled/read-only no-op.
- Part forwarding: only public part props and explicit test-owned IDs.

## Example Coverage Anchors

- `button/button.spec.tsx`: visible button, disabled no-op, icon rendering, accessible name.
- `dialog/dialog.spec.tsx`: portal behavior, close behavior, focus management, accessible name and description.
- `combobox/__tests__/*.spec.tsx`: split by behavior area, including open/close, keyboard, callbacks, collection, clear, and selection.
- `number-input/number-input.spec.tsx`: numeric constraints, typed values, buttons, keyboard, invalid state, form behavior, unit selection.
- `switch/switch.spec.tsx`: checked state, Space key, callbacks, read-only no-op, focus changes, and form behavior.

## Review Questions

- Does each test name describe the scenario and expected outcome?
- Could the same public behavior be implemented with different markup and still pass?
- Are callbacks triggered through real user actions?
- Are both API styles covered when they should expose the same behavior?
- Is any `getByTestId` backed by a test-owned public hook or inaccessible public part?
