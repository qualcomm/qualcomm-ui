# Component Testing

Use this reference for component tests, regardless of framework. It complements `references/behavior-testing.md`.

## Component Surface

Map the public component contract before writing assertions:

- Inputs: props, inputs, slots, children, content projection, default values, and controlled state.
- Outputs: callbacks, emitted events, submitted form data, visible side effects, and documented state changes.
- User interactions: pointer, keyboard, focus, text entry, open/close, selection, clearing, and disabled or read-only no-ops.
- Accessibility: role, name, label, description, required/disabled/invalid state, value state, and focus behavior.
- Public variants: alternate APIs or render modes that claim the same behavior.

## Component Workflow

1. Start with the behavior a user or consumer observes, not the internal tree that currently implements it.
2. Use accessible queries first. Use test IDs only when the part is public but inaccessible, or when the test passes a test-owned hook through a public API.
3. Trigger callbacks and events through real public interactions before asserting payloads.
4. Cover equivalent public API variants with the same behavior assertions when the component exposes them.
5. For missing public surfaces, either add a lower-level test for the public part or report that the behavior cannot be tested without implementation coupling.

## Test Shape

- Name tests by scenario and expected outcome, not implementation mechanics. Avoid names like "works", "renders correctly", or "handles props".
- Keep helper components and fixtures minimal. Add test-owned readouts only when they expose a public component contract such as controlled state, context, form value, or emitted output.
- Mock external systems such as network, timers, storage, or platform APIs. Do not mock the component under test or its direct child components when public behavior can be exercised directly.

## Component-Specific Rejections

Reject tests that assert:

- Child component internals to prove parent behavior.
- Wrapper structure, exact node order, generated IDs, internal styling attributes, CSS classes, or icon/SVG internals.
- Component state by reading private fields, private hooks, directive instances, or framework internals.
- Test-only rendered diagnostics that exist solely to expose implementation shape.

## Coverage Checklist

For new or substantially revised component suites, consider:

- Rendering: role, name, label, visible text, empty states, and descriptions.
- State: default, controlled/external, disabled, read-only, invalid, loading, and edge constraints.
- Interactions: click, typing, keyboard navigation, focus movement, Escape, Tab, Home/End where supported.
- Forms: value, required/disabled/invalid behavior, reset, and submitted data.
- Callbacks/events: payloads after public user actions.
- Variants: equivalent behavior across documented component APIs.
