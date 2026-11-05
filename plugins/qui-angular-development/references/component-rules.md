# QUI Angular Component Rules

This reference is the shared source of truth for the QUI Angular development skills. It covers only the Angular template contracts listed below.

These rules apply to Angular templates that consume `@qualcomm-ui/angular/*` and `@qualcomm-ui/angular-internal/*` components and directives.

## Covered Rules

- `accessible-name`
  - Target context: `q-icon-button`, `q-inline-icon-button`, or `q-header-bar-action-icon-button`.
  - Contract: provide a non-empty `aria-label` or `aria-labelledby`, either statically or through `[attr.aria-label]` / `[attr.aria-labelledby]`.
- `avatar-image-alt`
  - Target context: `q-avatar-image`.
  - Contract: provide a non-empty `alt`, either statically or through `[alt]`.
- `input-label-association`
  - Target context: simple or compound-root `q-text-input`, `q-number-input`, `q-password-input`, `q-select`, `q-combobox`, `q-switch`, `q-checkbox`, or `q-radio`.
  - Contract: provide an accessible label:
    - Simple component or directive usage: a non-empty `label`, `aria-label`, or `aria-labelledby` input, a projected label child such as `q-text-input-label`, or a projected control child with its own accepted label.
    - Compound root usage: a label child such as `q-text-input-label`, or the component's control child with its own accepted label.
    - Control child labels: non-empty `aria-label` or `aria-labelledby` on the actual control child (`q-text-input-input`, `q-number-input-input`, `q-password-input-input`, `q-select-control`, `q-combobox-input`, `q-switch-hidden-input`, `q-checkbox-hidden-input`, or `q-radio-hidden-input`).
  - Do not count `[attr.aria-label]` or `[attr.aria-labelledby]` on a simple component host as satisfying `input-label-association`; use `aria-label` or `aria-labelledby` there instead.
- `interactive-card-element-nesting`
  - Target context: `q-card` with the `interactive` attribute.
  - Contract: do not nest native interactive elements or covered QUI interactive descendants inside it. Covered descendants include `q-button`, `q-link`, `q-card-button`, `q-card-link`, `q-checkbox`, `q-combobox`, `q-icon-button`, `q-inline-icon-button`, `q-menu-button`, `q-menu-icon-button`, `q-number-input`, `q-password-input`, `q-radio`, `q-select`, `q-switch`, `q-text-area`, and `q-text-input`.
- `prefer-alert-banner-button`
  - Target context: actions inside `q-alert-banner`, `q-alert-banner-root`, or legacy `q-alert-banner-action`.
  - Contract: alert banner actions use `q-alert-banner-button`, not generic `q-button` or `q-alert-banner-action`.
- `prefer-card-actions`
  - Target context: actions inside `q-card`.
  - Contract: use `q-card-button` or `q-card-link`, not generic `q-button` or `q-link`.
- `prefer-header-bar-actions`
  - Target context: actions inside `q-header-bar-action-bar`.
  - Contract: use `q-header-bar-action-button` or `q-header-bar-action-icon-button`, not generic `q-button` or `q-icon-button`.
- `prefer-menu-trigger-buttons`
  - Target context: controls inside `q-menu-trigger`.
  - Contract: use `q-menu-button` or `q-menu-icon-button`, not generic button variants.
- `prefer-select-item-checkbox`
  - Target context: `q-select-root` with static `selectionIndicator="checkbox"` or `[selectionIndicator]="'checkbox'"` and a composed `q-select-item-indicator`.
  - Contract: use `q-select-item-checkbox` instead of composing `q-select-item-indicator`.

## Scope Boundary

Do not add findings or authoring requirements for non-covered components, non-QUI components, general Angular practices, theming, versioning, API discovery, or design preferences unless they directly create one of the component rule violations above.

Components named only as invalid descendants or replacements are not standalone triggers. For example, `q-button` matters inside `q-alert-banner`, `q-card`, `q-header-bar-action-bar`, or `q-menu-trigger`; a standalone `q-button` is outside this reference. `q-select-root` only matters for the checkbox-indicator rule when the static checkbox-indicator context above is present; other select usage is only covered by the label rule.
