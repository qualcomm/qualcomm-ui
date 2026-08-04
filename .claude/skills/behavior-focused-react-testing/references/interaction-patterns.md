# Interaction Patterns

Use this reference when testing user actions.

## Pointer And Text Input

Drive behavior through real browser interactions:

- Click visible labels, buttons, options, menu items, and triggers.
- Use `fill` or `userEvent.keyboard` for input value changes.
- Hover only when the public interaction is hover-based, such as nested menus.

Examples:

- `button/button.spec.tsx`: click a button and assert `onClick`.
- `checkbox/checkbox.spec.tsx`: click the label and assert checked state.
- `combobox/__tests__/combobox-open-close.spec.tsx`: click trigger to open and click again to close.
- `menu/menu.spec.tsx`: hover a nested trigger item and assert submenu content appears.

## Keyboard

Use `userEvent.tab()` for focus movement and `userEvent.keyboard` for key behavior:

- `{ArrowDown}`, `{ArrowUp}`, `{ArrowLeft}`, `{ArrowRight}`.
- `{Home}`, `{End}`.
- `{Escape}`, `{Space}`, `{Enter}`.
- `{PageUp}`, `{PageDown}` where the component supports larger steps.

Examples:

- `tabs/tabs.spec.tsx`: horizontal and vertical tab navigation, manual activation, focus management.
- `combobox/__tests__/combobox-keyboard.spec.tsx`: listbox opening and option highlight behavior.
- `slider/__tests__/slider.spec.tsx`: keyboard changes values and respects min/max, step, orientation, and range constraints.
- `number-input/number-input.spec.tsx`: keyboard stepping, Home/End, clamp-on-blur.

## Portals, Focus, And Outside Interaction

For overlays and portals, test user-observable behavior:

- Open and close presence.
- Escape behavior.
- Focus trap and restore focus.
- Outside interaction only through a public or test-owned surface.
- Accessible dialog/menu/listbox role and name.

Examples:

- `dialog/dialog.spec.tsx`: focus trap, restore focus, Escape, outside interaction, accessible name and description.
- `menu/menu.spec.tsx`: open/close and Escape.
- `combobox/__tests__/combobox-open-close.spec.tsx`: listbox appears and disappears.
