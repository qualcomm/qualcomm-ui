# QUI React Component Rules

This reference is the shared source of truth for the QUI React development skills. It covers only the component contracts listed below.

These rules apply to imports from `@qualcomm-ui/react/*` and `@qualcomm-ui/react-internal/*`.

## Covered Rules

- `accessible-name`
  - Target context: `IconButton`, `InlineIconButton`, or `HeaderBarActionIconButton`.
  - Contract: provide a non-empty `aria-label` or `aria-labelledby`.
- `avatar-image-alt`
  - Target context: `Avatar.Image`.
  - Contract: provide a non-empty `alt`.
- `input-label-association`
  - Target context: simple or compound-root `TextInput`, `NumberInput`, `PasswordInput`, `Select`, `Combobox`, `Switch`, `Checkbox`, or `Radio`.
  - Contract: provide an accessible label. Valid forms are a non-empty `label`, direct `aria-label`/`aria-labelledby`, `inputProps`, `controlProps`, `hiddenInputProps`, a compound `<X.Label>`, or aria on the compound input/hidden input/control.
- `interactive-card-element-nesting`
  - Target context: `Card.Root` with the `interactive` prop.
  - Contract: do not nest native interactive elements or covered QUI interactive descendants inside it. Covered descendants include `Button`, `Link`, `Card.Button`, `Card.Link`, `Checkbox`, `Combobox`, `IconButton`, `InlineIconButton`, `Menu.Button`, `Menu.IconButton`, `Menu.InlineIconButton`, `NumberInput`, `PasswordInput`, `Radio`, `Select`, `Switch`, and `TextInput`.
- `prefer-alert-banner-button`
  - Target context: an `AlertBanner` `action` prop, `AlertBanner.Root`, or `AlertBanner.ActionContainer`.
  - Contract: alert banner actions use `AlertBanner.Button`, not QUI `Button` or `AlertBanner.ActionContainer`.
- `prefer-card-actions`
  - Target context: actions inside `Card.Root`.
  - Contract: use `Card.Button` or `Card.Link`, not QUI `Button` or `Link`.
- `prefer-header-bar-actions`
  - Target context: actions inside `HeaderBar.ActionBar`.
  - Contract: use `HeaderBar.ActionButton` or `HeaderBar.ActionIconButton`, not QUI `Button` or `IconButton`.
- `prefer-menu-trigger-buttons`
  - Target context: controls inside `Menu.Trigger`.
  - Contract: use `Menu.Button`, `Menu.IconButton`, or `Menu.InlineIconButton`, not generic QUI button variants.
- `prefer-select-item-checkbox`
  - Target context: `Select.Root` with static `selectionIndicator="checkbox"` and a composed `Select.ItemIndicator`.
  - Contract: use `Select.ItemCheckbox` instead of composing `Select.ItemIndicator`.

## Scope Boundary

Do not add findings or authoring requirements for non-covered components, non-QUI components, general React practices, theming, versioning, API discovery, or design preferences unless they directly create one of the component rule violations above.

Components named only as invalid descendants or replacements are not standalone triggers. For example, QUI `Button` matters inside `AlertBanner.Root`, `Card.Root`, `HeaderBar.ActionBar`, or `Menu.Trigger`; a standalone QUI `Button` is outside this reference. `Select.Root` only matters for the checkbox-indicator rule when the static checkbox-indicator context above is present; other `Select` usage is only covered by the label rule.
