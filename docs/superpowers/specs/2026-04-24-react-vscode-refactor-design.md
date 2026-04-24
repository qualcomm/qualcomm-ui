# react-vscode Refactor: Align With react-core Architecture

## Context

The `@qualcomm-ui/react-vscode` package (`packages/frameworks/react-vscode/`) was seeded by copying an older external VS Code component library. The migration onto this monorepo's architecture is incomplete: most components expose a **minimal shell** rather than the full compositional surface that the QDS `@qualcomm-ui/react` package provides.

The monorepo's intended architecture is layered:

```
react          — QDS-themed components (react-core + qds-core styling)
react-vscode   — VS Code-themed components (react-core + VS Code CSS)   ← target
                 ▼
react-core     — Framework-only behavior: state machines, contexts, a11y,
                 prop bindings. No styling.
                 ▼
core           — Framework-agnostic machine/API definitions.
```

`react-vscode` components must sit at the same layer as QDS `react`: thin styling wrappers over `react-core` primitives. The **only** difference between a QDS `react` component and its `react-vscode` peer should be:

1. Styling source: `qds-core` bindings (`createQds*Api`, `qds*Classes`) are replaced by VS Code CSS classes (`vs-*`).
2. A handful of VS Code-specific affordances (codicon icons, keybinding rendering) that don't exist in QDS.

The compositional surface (parts, props, render prop shapes) must mirror the QDS peer.

### Two APIs per component

QDS ships every component with both:

- **Compound API** — individual parts (`Checkbox.Root`, `Checkbox.Control`, `Checkbox.Label`, etc.) exported via a namespace object and as standalone exports. Grants full control.
- **Simple API** — a single top-level component (`<Checkbox label="..." hint="..." errorText="..." />`) that wires the compound parts into the canonical composition and handles id/ARIA plumbing. **The 90% common use case.**

Where QDS provides a Simple API, `react-vscode` must too. Where QDS is compound-only (Menu, Tabs, Steps, Dialog), `react-vscode` matches that decision.

### Today's gaps

Audit of 23 migrated components:

**Surface too narrow (fixable):** menu, stepper (steps), tooltip, dropdown (→ select), progress, progress-circle, checkbox, input (→ text-input), tabs.

**Wrong state machine:** both `menu/` and `dropdown/` sit on top of `react-core/popover` instead of the correct primitive (`react-core/menu` for Menu, `react-core/select` for Dropdown-as-Select). The popover layer supplies open/close, positioning, and outside-click behavior — it does not supply menu-item focus navigation, value tracking, typeahead, or native-form integration. Those must come from the correct state machine.

**Missing entirely:** popover (a generic popover compound doesn't exist — overlay-panel is a reskinned duplicate of dropdown).

**Clear carbon copy:** `menu-item.tsx` is a styled `<button>` with `role="menuitem"`. It skips `useMenuItem` / `splitMenuItemProps` / `MenuItemContextProvider`, so it has no menu-state-machine wiring (no arrow-key nav, no selection, no disabled-from-context, no value).

**OK as-is:** dialog (already mirrors QDS's 13-part compound), disclosure (wraps `CoreCollapsible` correctly), field, button, icon-button, badge, icon, keybinding, status, table/tbody/td/th/tr/thead, catalog-card/*.

**Absorbed:** `dropdown-input/` folds into `src/select/select-control.tsx` (see scope #4). The old directory and docs page are deleted.

## Goal

Bring the listed 10 components up to architectural parity with their QDS peers — full compound API + Simple API where applicable — and introduce a generic `popover` compound. Swap styling via CSS classes; do not duplicate behavior that `react-core` already provides.

### Menu vs Dropdown vs Popover: three primitives, three state machines

Menu, Dropdown, and OverlayPanel currently all sit on top of `react-core/popover` and differ only by role attributes and CSS class. That's the wrong factoring. The demos reveal their actual semantics:

- `MenuShowcaseDemo`: a list of `<MenuItem>` commands (Cut/Copy/Paste) — **action menu**.
- `DropdownShowcaseDemo`: a trigger showing the currently selected label plus a list of `<Option value="…">` items — **value picker (a select)**.
- `OverlayPanelShowcaseDemo`: a trigger and arbitrary content — **generic popover**.

Each maps to a different `react-core` state machine:

| VSCode component | Intended primitive | Why |
|---|---|---|
| **Menu** | `react-core/menu` (`useMenu`, `useMenuItem`) | Action menu. Arrow-key focus, Enter triggers `onSelect`, auto-close, typeahead, radio/checkbox items, item groups. |
| **Select** (rename from Dropdown) | `react-core/select` (`useSelect`, `CoreSelect.*`) | Value picker. Tracks selected value, renders it on trigger, hidden native `<select>` for form integration, arrow-navigation between options, typeahead. |
| **Popover** (new) | `react-core/popover` (`usePopover`) | Generic panel reveal. No item semantics. Absorbs overlay-panel. |

CSS may stay similar (the three are visually overlapping in VS Code). Behavior stays distinct.

**Rename**: `src/dropdown/` → `src/select/`. Component names: `Dropdown*` → `Select*` (e.g., `Dropdown` → `Select`, `DropdownTrigger` → `SelectTrigger`, `DropdownContent` → `SelectContent`). The subpath import changes from `@qualcomm-ui/react-vscode/dropdown` to `@qualcomm-ui/react-vscode/select`. This is a candidate breaking change for any consumer.

**Fold DropdownInput into SelectControl**: `src/dropdown-input/` is deleted. Its visual — the styled chevron-trigger button with `fill`/`ghost` variants — becomes `src/select/select-control.tsx`, built on `CoreSelect.Control`. The existing `.vs-dropdown-input*` CSS is renamed to `.vs-select__control*` (keeping the same rules and `data-variant` states). The `DropdownInputVariant` type (`"fill" | "ghost"`) becomes `SelectControlVariant`. The standalone `DropdownInput` component and its `@qualcomm-ui/react-vscode/dropdown-input` subpath export disappear. Docs page `components+/dropdown-input+/` and `_dropdown-input.mdx` + demos are removed; the variant demo is absorbed into the new `_select.mdx`. Any consumer (e.g., `dialog-form-demo.tsx`) of `DropdownInput` moves to `<Select.Control>` (or to the Simple `<Select>` with `controlProps={{variant: "ghost"}}`).

The existing native `<option>` wrapper in `src/option/option.tsx` is preserved for consumers of native `<select>` elements. It is **not** a Select item. Select uses a new `SelectItem` built on `CoreSelect.Item`.

## Out of scope

- Tests (`.spec.tsx` files) — tracked separately.
- Docs page authoring for `input` / `option` — tracked separately.
- Home page component carousel (TODO.md).
- Additional component ports (accordion, avatar, drawer, toast, tree, etc.).
- Visual redesigns. This refactor preserves the existing look; it only reshapes the API and internal wiring.

## Scope (confirmed)

| # | Component | Work type |
|---|-----------|-----------|
| 1 | **menu** | Rebuild on `react-core/menu` (not popover). Split `menu.tsx`; rewrite `menu-item` around `useMenuItem`; add ~20 missing parts; add `Menu` namespace export |
| 2 | **stepper (steps)** | Add `Label`, `IndicatorIcon`, `Content`, `CompletedContent`, `NextTrigger`, `PrevTrigger`, `Hint`, `Context` |
| 3 | **tooltip** | Split into `Root`/`Trigger`/`Positioner`/`Content`/`Arrow`/`ArrowTip`; rewrite Simple `<Tooltip>` to match QDS ergonomics (`trigger` render prop + `children`) |
| 4 | **select** (rename from `dropdown`, absorbs `dropdown-input`) | Rebuild on `react-core/select` (`CoreSelect`), not popover. Rename directory `dropdown/` → `select/`. Add `Root`, `Control` (styled like the old DropdownInput with `fill`/`ghost` variants), `Trigger`, `Content`, `Positioner`, `Item`, `ItemText`, `ItemIndicator`, `HiddenSelect`, `Label`, `Hint`, `ErrorText`, `ClearTrigger`; add Simple `<Select>`. **Delete** `src/dropdown-input/` and its docs. |
| 5 | **popover** (new) | Create full popover compound under `src/popover/` with Simple API |
| 6 | **overlay-panel** | **Delete.** Replaced by `popover`. Update demo + MDX + CSS. |
| 7 | **progress** | Add `ErrorText`, `Hint`, `Context`; extend Simple `<Progress>` with `hint` / `errorText` / `invalid` props |
| 8 | **progress-circle** | Add `Bar`, `CircleContainer`, `Context`, `ErrorText`, `Track`, `ValueText`; extend Simple `<ProgressCircle>` |
| 9 | **checkbox** | Add `ErrorText`, `Hint`; extend Simple `<Checkbox>` with `hint` / `errorText` / `invalid` props |
| 10 | **input → text-input** | Rebuild around `CoreTextInput`: `Root`/`Input`/`InputGroup`/`Label`/`Hint`/`ErrorText`/`ErrorIndicator`/`ClearTrigger` + Simple `<TextInput>`. Keep `Input` + `InputGroup` as thin back-compat re-exports from text-input if needed. |
| 11 | **tabs** | Add `Indicator`, `DismissButton`, `Context` |
| 12 | **option** (kept) | No changes. Remains the native `<option>` wrapper for consumers using a native `<select>`. Separate from the new Select compound (which lives under `src/select/`, see #4). |

## Canonical reference: how each VS Code part should look

The QDS peer is the spec. Because VS Code ships **no** `qds-core` layer and **no** `QdsXxxContextProvider`, each VS Code part is the QDS peer minus the QDS styling plumbing, plus `vs-*` CSS classes applied via `mergeProps`.

### Pattern A — "Root" part

QDS ref: `packages/frameworks/react/src/menu/menu-root.tsx`

VS Code shape:

```tsx
import type {ReactElement, ReactNode} from "react"
import type {MenuApiProps} from "@qualcomm-ui/core/menu"
import {
  type PresenceApiProps,
  splitPresenceProps,
} from "@qualcomm-ui/core/presence"
import {
  MenuContextProvider,
  MenuMachineContextProvider,
  MenuTriggerContextProvider,
  useMenu,
} from "@qualcomm-ui/react-core/menu"
import {
  PresenceContextProvider,
  usePresence,
} from "@qualcomm-ui/react-core/presence"
import type {Optional} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuRootProps extends Optional<MenuApiProps, "id">, PresenceApiProps {
  children: ReactNode
}

export function MenuRoot({children, ...props}: MenuRootProps): ReactElement {
  const [presenceProps, menuProps] = splitPresenceProps(props)
  const {api, machine, triggerItemContext} = useMenu(menuProps)
  const presenceApi = usePresence(mergeProps({present: api.open}, presenceProps))
  return (
    <MenuMachineContextProvider value={machine}>
      <MenuContextProvider value={api}>
        <MenuTriggerContextProvider value={triggerItemContext}>
          <PresenceContextProvider value={presenceApi}>
            {children}
          </PresenceContextProvider>
        </MenuTriggerContextProvider>
      </MenuContextProvider>
    </MenuMachineContextProvider>
  )
}
```

Drop every `QdsXxxApi`, `createQdsXxxApi`, `qdsXxxClasses` import. Everything else transfers.

### Pattern B — Presentational part that adds `vs-*` CSS class

QDS ref: `packages/frameworks/react/src/menu/menu-content.tsx`

```tsx
export function MenuContent({children, id, ...props}: MenuContentProps): ReactElement | null {
  const contextProps = useMenuContent({id})
  if (contextProps === null) return null
  const mergedProps = mergeProps(contextProps, {className: "vs-menu"}, props)
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
```

Rule: the only edit vs. the QDS peer is dropping `qdsContext.getXxxBindings()` from the `mergeProps` chain and substituting `{className: "vs-..."}`.

### Pattern C — Item with state-machine wiring (the menu-item fix)

QDS ref: `packages/frameworks/react/src/menu/menu-item.tsx`

```tsx
export function MenuItem({children, ...props}: MenuItemProps): ReactElement {
  const [menuItemProps, localProps] = splitMenuItemProps(props)
  const {bindings, itemContextValue} = useMenuItem(menuItemProps)
  const mergedProps = mergeProps(bindings, {className: "vs-menu-item"}, localProps)
  return (
    <MenuItemContextProvider value={itemContextValue}>
      <PolymorphicElement as="button" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </MenuItemContextProvider>
  )
}
```

VS Code additions (icons, accessory slots) that aren't in QDS stay, but they live **inside** this hook-wired shell — not as a replacement for it.

### Pattern D — Simple API aggregator

QDS ref: `packages/frameworks/react/src/checkbox/checkbox.tsx` and `packages/frameworks/react/src/progress/progress.tsx`

Accept optional ergonomic props (`label`, `hint`, `errorText`, `barProps`, `labelProps`, …). Generate ids with `useControlledId` + `useOptionalContentId`. Render the full compound tree. Omit children for sections whose content prop is empty. Mirror the exact prop shape of the QDS peer where one exists.

### Pattern E — Namespace export

QDS ref: `packages/frameworks/react/src/menu/index.ts` (Menu), `packages/frameworks/react/src/tabs/tabs/index.ts` (Tabs)

Export the compound parts individually **and** as a namespace object:

```ts
export const Menu: MenuComponent = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  // ...
}
```

Keep both so consumers can use `Menu.Root` or `import {MenuRoot}` interchangeably.

## Execution principles

1. **One component at a time**, with a commit per component. Each commit gets the title scope at module level (per auto-memory feedback): `refactor(menu): …`, not `refactor(react-vscode): …`.
2. **Mirror QDS filenames**: `menu-root.tsx`, `menu-content.tsx`, `menu-item-group.tsx`, etc. Deviate only where VS Code adds genuinely new parts (e.g., `menu-item-accessory.tsx` exists in QDS; mirror it rather than inventing a VSCode-specific name).
3. **Type imports first.** For each new part, import the QDS peer to see which `Core*` types, `splitXxxProps` helpers, and context hooks it depends on. Reuse them directly from `react-core` / `core`.
4. **Prefer `mergeProps`** (`@qualcomm-ui/utils/merge-props`) for combining bindings. Order: `contextBindings, {className: "vs-xxx"}, props`. Incoming `props` always last so consumers can override.
5. **No duplicated state machines.** If a hook exists in `react-core`, use it. Carbon-copy detection heuristic: if the VS Code file sets `role=`, `aria-*`, or `data-state` attributes manually *and* there is a corresponding `use<Name>` hook in `react-core/<component>/`, it is wrong — use the hook.
6. **Simple API mirrors the QDS prop shape.** If QDS `<Checkbox>` takes `{label, hint, errorText, invalid, controlProps, labelProps, hintProps, errorTextProps, ids, "aria-label", "aria-labelledby"}`, VS Code must too.
7. **Don't add new compound parts the QDS peer lacks** unless they represent a genuine VS Code design need (e.g., keybinding integration, codicon slots). Keep the surface in sync.

## Per-component work list

For each entry:

- **QDS ref**: canonical implementation to mirror (minus QDS styling).
- **Current VSCode files**: what exists today.
- **Operations**: file create/modify/delete.
- **CSS**: classes to preserve or ensure exist in `packages/common/tailwind-plugin/src/qui-vscode.css`.

The implementation plan (next document) expands each entry into bite-sized steps. This spec captures the *what*, not the *how*.

### 1. menu

- **QDS ref**: `packages/frameworks/react/src/menu/` (25 tsx files + `index.ts` + `qds-menu-context.ts`)
- **Current VSCode**: `menu.tsx` (bundles Menu/MenuTrigger/MenuContent), `menu-item.tsx` (carbon copy), `index.ts`, `vs-menu.css`.
- **Operations**:
  - **Delete**: `menu.tsx` (content redistributed).
  - **Create**: `menu-root.tsx`, `menu-trigger.tsx`, `menu-content.tsx`, `menu-positioner.tsx`, `menu-separator.tsx`, `menu-item-group.tsx`, `menu-item-group-label.tsx`, `menu-item-label.tsx`, `menu-item-description.tsx`, `menu-item-command.tsx`, `menu-item-accessory.tsx`, `menu-item-indicator.tsx`, `menu-item-start-icon.tsx`, `menu-checkbox-item.tsx`, `menu-checkbox-item-control.tsx`, `menu-radio-item.tsx`, `menu-radio-item-control.tsx`, `menu-radio-item-group.tsx`, `menu-trigger-item.tsx`, `menu-context-trigger.tsx`, `menu-button.tsx`, `menu-icon-button.tsx`, `menu-inline-icon-button.tsx`.
  - **Rewrite**: `menu-item.tsx` per Pattern C (use `useMenuItem` + `splitMenuItemProps` + `MenuItemContextProvider`). Preserve its VS Code-specific `startIcon`/`endIcon` props as internal composition inside the shell.
  - **Rewrite**: `index.ts` to export every part and a `Menu` namespace object (see Pattern E). Drop the two-line `export *` shim.
- **CSS**: existing `.vs-menu` / `.vs-menu-item` rules stay; add rules for new parts (`.vs-menu__item-group`, `.vs-menu__separator`, `.vs-menu__item-group-label`, `.vs-menu__item-label`, `.vs-menu__item-description`, `.vs-menu__item-command`, `.vs-menu__checkbox-item`, `.vs-menu__radio-item`) as needed to match VSCode's native menu visuals. **If a class already exists in `qui-vscode.css`**, reuse it; otherwise add new CSS entries that harmonize with the existing `.vs-menu-item` design.

### 2. stepper (steps)

- **QDS ref**: `packages/frameworks/react/src/stepper/` (13 parts + context)
- **Current VSCode** (`src/steps/`): `steps-root.tsx`, `step-list.tsx`, `step-item.tsx`, `step-trigger.tsx`, `step-indicator.tsx`, `step-separator.tsx`, `index.ts`, `vs-steps.css`.
- **Operations**:
  - **Create**: `step-label.tsx`, `step-indicator-icon.tsx`, `step-content.tsx`, `step-completed-content.tsx`, `step-next-trigger.tsx`, `step-prev-trigger.tsx`, `step-hint.tsx`, `steps-context.tsx`.
  - **Modify**: `index.ts` to export all parts and a `Steps` namespace object. The existing `Steps.Root`/`.List`/… naming stays (don't rename to `Stepper`) since this package already uses the `Steps`/`Step*` convention.
- **CSS**: add `.vs-steps__label`, `.vs-steps__indicator-icon`, `.vs-steps__content`, `.vs-steps__completed-content`, `.vs-steps__next-trigger`, `.vs-steps__prev-trigger`, `.vs-steps__hint` as needed.

### 3. tooltip

- **QDS ref**: `packages/frameworks/react/src/tooltip/` (tooltip-root, tooltip-trigger, tooltip-content, tooltip-positioner, tooltip-arrow, tooltip-arrow-tip, tooltip.tsx Simple)
- **Current VSCode** (`src/tooltip/`): `tooltip.tsx` (just `useTooltip` + `TooltipContextProvider`; this is actually the *Root*), `tooltip-trigger.tsx`, `tooltip-content.tsx`.
- **Operations**:
  - **Rename/Replace**: `tooltip.tsx` currently holds Root logic. Move Root into **new** `tooltip-root.tsx`. Repurpose `tooltip.tsx` as the **Simple API** aggregator (Pattern D) with the QDS prop shape: `{trigger: BindingRenderProp<TooltipTriggerBindings>, children: ReactNode, hideArrow?: boolean, arrowProps?, arrowTipProps?, contentProps?, portalProps?, positionerProps?, ...rootProps}`.
  - **Create**: `tooltip-positioner.tsx`, `tooltip-arrow.tsx`, `tooltip-arrow-tip.tsx`.
  - **Modify**: `tooltip-trigger.tsx` and `tooltip-content.tsx` to match QDS Patterns B/A (should be a near-copy; drop QDS styling).
  - **Modify**: `index.ts` to export all parts + `Tooltip` namespace + `Tooltip` simple function.
- **CSS**: add `.vs-tooltip__positioner`, `.vs-tooltip__arrow`, `.vs-tooltip__arrow-tip` if not already present.

### 4. select (renamed from dropdown, absorbs dropdown-input)

- **QDS ref**: `packages/frameworks/react/src/select/` (20 parts — select-root, select-control, select-trigger, select-content, select-positioner, select-item, select-item-text, select-item-indicator, select-item-group, select-item-group-label, select-label, select-hint, select-error-text, select-error-indicator, select-clear-trigger, select-hidden-select, select.tsx Simple, plus qds-select-context.ts which we skip)
- **Current VSCode**:
  - `src/dropdown/`: `dropdown.tsx` (popover-based, bundles Root/Trigger/Content), `index.ts`, `vs-dropdown.css`.
  - `src/dropdown-input/`: `dropdown-input.tsx`, `dropdown-input.types.ts`, `index.ts`, `vs-dropdown-input.css`.
- **Operations**:
  - **Rename directory**: `src/dropdown/` → `src/select/`.
  - **Delete**: `dropdown.tsx` (contents replaced by the new compound built on `CoreSelect`).
  - **Delete directory**: `src/dropdown-input/` entirely. Its export surface collapses into `SelectControl`.
  - **Create**: `select-root.tsx`, `select-control.tsx`, `select-trigger.tsx`, `select-content.tsx`, `select-positioner.tsx`, `select-item.tsx`, `select-item-text.tsx`, `select-item-indicator.tsx`, `select-item-group.tsx`, `select-item-group-label.tsx`, `select-label.tsx`, `select-hint.tsx`, `select-error-text.tsx`, `select-error-indicator.tsx`, `select-clear-trigger.tsx`, `select-hidden-select.tsx`, `select.tsx` (Simple API).
  - **Merge CSS**: `vs-dropdown.css` + `vs-dropdown-input.css` → `vs-select.css`. Rename class prefix `.vs-dropdown*` → `.vs-select*`. Merge `.vs-dropdown-input` rules into `.vs-select__control` rules (keep the `data-variant="fill"` / `data-variant="ghost"` styling and the chevron rotation on `aria-expanded="true"`). Regenerate `packages/common/tailwind-plugin/src/qui-vscode.css` after the source CSS changes.
  - **Modify**: `index.ts` — export all parts + `Select` namespace object + simple `Select` function.
  - **Type carryover**: `DropdownInputVariant` (`"fill" | "ghost"`) becomes `SelectControlVariant` on `SelectControlProps`.
- **SelectControl shape**: built on `CoreSelect.Control`. Renders a `<button>` (polymorphic via `ElementRenderProp<"button">`). Internally renders: `{valueText}` + chevron `<Icon icon="chevron-down" />`. Value text comes from `SelectValueText` (a sub-part bound to `useSelect().valueAsString`) or a children prop passed by the Simple API. The `variant` prop applies `data-variant` for styling. When closed, the chevron points down; when open (`aria-expanded="true"`), the chevron rotates — preserved from the existing DropdownInput.
- **State-machine change**: this is the most consequential shift of the plan. The component moves from popover semantics to select semantics: `useSelect` (tracks `value`, `defaultValue`, `collection`, `onValueChange`) replaces `usePopover`. The Simple `<Select>` accepts the `collection` directly via `SelectRootProps` — it does **not** accept an `items` array and does not synthesize a collection internally. Callers build their own `ListCollection` and pass it in, matching QDS's `<Select>` signature (`SelectProps extends SelectRootProps`, no items sugar).
- **Demo migration**:
  - `components+/dropdown+/` → rename to `select+/`. `dropdown-showcase-demo.tsx` → `select-showcase-demo.tsx`, switching from `<Option>` children inside `<DropdownContent>` to `<SelectItem>` children inside `<SelectContent>`, and from `<DropdownInput>` as the trigger child to `<SelectControl>` (or letting the Simple `<Select>` render it).
  - `components+/dropdown-input+/` — **delete entirely**. Absorb the `dropdown-input-variants-demo.tsx` into the new `_select.mdx` as a "Control variants" section demonstrating `<Select controlProps={{variant: "ghost"}}>`.
  - `dialog-form-demo.tsx` — update its `<DropdownInput>` usage. If it was a real select (options implied), switch to `<Select>`; if it was just a styled trigger button for something else, inline `<Select.Control>` with the appropriate bindings.
- **Consumer sweep**: `grep -r "@qualcomm-ui/react-vscode/dropdown\|@qualcomm-ui/react-vscode/dropdown-input\|DropdownInput\|from \"@qualcomm-ui/react-vscode\".*Dropdown" packages/` to catch every import. Update all.

### 5. popover (new)

- **QDS ref**: same as dropdown.
- **Operations**:
  - **Create directory**: `src/popover/` with the full compound (same file set as dropdown: 12 files) plus `vs-popover.css`.
  - **Modify**: `packages/common/tailwind-plugin/src/qui-vscode.css` to include the new `.vs-popover*` classes.
- Naming difference vs dropdown: `.vs-popover` vs `.vs-dropdown`. Functionally identical; separate class roots let designers tune them independently.

### 6. overlay-panel (remove)

- **Operations**:
  - **Delete**: `packages/frameworks/react-vscode/src/overlay-panel/` (entire directory).
  - **Delete**: `packages/docs/react-vscode-docs/src/routes/components+/overlay-panel+/` (entire directory).
  - **Update CSS**: remove `.vs-overlay-panel*` rules from `packages/common/tailwind-plugin/src/qui-vscode.css`.
  - **Migrate demos**: `overlay-panel-showcase-demo.tsx` → recreate under `components+/popover+/demos/popover-showcase-demo.tsx` using the new `Popover` API. Use the existing visual styling as a reference.
  - **Search for other references**: `grep -r "overlay-panel\|OverlayPanel" packages/` and update any remaining imports/docs.

### 7. progress

- **QDS ref**: `packages/frameworks/react/src/progress/` (bar, context, error-text, hint, label, root, track, value-text, progress.tsx Simple)
- **Current VSCode** (`src/progress/`): `progress-root.tsx`, `progress-bar.tsx`, `progress-label.tsx`, `progress-track.tsx`, `progress-value.tsx` (note: named `Value`, QDS names it `ValueText`), `progress.tsx` (Simple), `index.ts`, `vs-progress.css`.
- **Operations**:
  - **Create**: `progress-error-text.tsx`, `progress-hint.tsx`, `progress-context.tsx`.
  - **Rename**: `progress-value.tsx` → `progress-value-text.tsx` (file), `ProgressValue` → `ProgressValueText` (export). Keep `progress.tsx` Simple prop `valueText`/`valueTextProps` (it already uses those names).
  - **Modify**: `progress.tsx` (Simple) — add `hint`, `hintProps`, `errorText`, `errorTextProps`, `invalid` props mirroring QDS.
  - **Modify**: `index.ts` — export all parts + `Progress` namespace (add the namespace object).
- **CSS**: add `.vs-progress__hint`, `.vs-progress__error-text` classes.

### 8. progress-circle

- **QDS ref**: `packages/frameworks/react/src/progress-ring/` (9 parts + ring.tsx Simple)
- **Current VSCode** (`src/progress-circle/`): `progress-circle-root.tsx`, `progress-circle-circle.tsx`, `progress-circle-label.tsx`, `progress-circle.tsx` (Simple), `progress-circle-context.ts`, `progress-circle.types.ts`, `progress-circle.utils.ts`, `index.ts`, `vs-progress-circle.css`.
- **Operations**:
  - **Create**: `progress-circle-bar.tsx`, `progress-circle-track.tsx`, `progress-circle-value-text.tsx`, `progress-circle-error-text.tsx`, `progress-circle-circle-container.tsx`.
  - **Note**: `progress-circle-context.ts` already exists — it holds the VSCode-local ring sizing context. Verify whether it overlaps with `progress-context` (from `react-core/progress`). Keep the local sizing context if it still serves; otherwise fold it into a reusable `ProgressCircleContext` matching QDS's `progress-ring-context.tsx`.
  - **Modify**: `progress-circle.tsx` (Simple) — add `hint`, `errorText`, `valueText` + `*Props` props matching QDS's `progress-ring.tsx`.
  - **Modify**: `index.ts` — full exports + `ProgressCircle` namespace.
- **CSS**: add `.vs-progress-circle__bar`, `.vs-progress-circle__track`, `.vs-progress-circle__value-text`, `.vs-progress-circle__error-text`, `.vs-progress-circle__circle-container`.

### 9. checkbox

- **QDS ref**: `packages/frameworks/react/src/checkbox/` (root, control, error-text, hidden-input, hint, indicator, label, context, checkbox.tsx Simple)
- **Current VSCode** (`src/checkbox/`): already close — has `checkbox-root.tsx`, `checkbox-control.tsx`, `checkbox-hidden-input.tsx`, `checkbox-indicator.tsx`, `checkbox-label.tsx`, `checkbox-context.tsx`, `checkbox.tsx` (Simple). Missing `checkbox-error-text.tsx` and `checkbox-hint.tsx`.
- **Operations**:
  - **Create**: `checkbox-error-text.tsx`, `checkbox-hint.tsx`. Follow QDS's implementation — QDS's version imports `InputErrorText`/`InputHint` from `@qualcomm-ui/react/input`; the VS Code version should render plain `<div>` elements with VS Code styles instead (we're not importing from the QDS package).
  - **Modify**: `checkbox.tsx` (Simple) — add `hint`, `hintProps`, `errorText`, `errorTextProps`, `invalid` props; wire `ids.hint` / `ids.errorText` via `useOptionalContentId` and extend the `CheckboxElementIds` object.
  - **Modify**: `index.ts` — export new parts.
- **CSS**: add `.vs-checkbox__hint`, `.vs-checkbox__error-text`.

### 10. input → text-input

- **QDS ref**: `packages/frameworks/react/src/text-input/` (root, input, input-group, label, hint, error-text, error-indicator, clear-trigger, text-input.tsx Simple)
- **Current VSCode** (`src/input/`): `input.tsx`, `input-group.tsx`, `index.ts`, `vs-input.css`. `input.tsx` uses `useFieldContext` and `useControlledId` directly — no use of `CoreTextInput`.
- **Operations**:
  - **Rename directory**: `src/input/` → `src/text-input/`.
  - **Create**: `text-input-root.tsx`, `text-input-input.tsx`, `text-input-input-group.tsx`, `text-input-label.tsx`, `text-input-hint.tsx`, `text-input-error-text.tsx`, `text-input-error-indicator.tsx`, `text-input-clear-trigger.tsx`, `text-input.tsx` (Simple).
  - **Delete**: `input.tsx`, `input-group.tsx`.
  - **Rename CSS**: `vs-input.css` → `vs-text-input.css`; update classes from `.vs-input*` → `.vs-text-input*` (or keep `.vs-input` as an alias if that name is already baked into other demos).
  - **Modify**: `index.ts` — export all parts + `TextInput` namespace + simple `TextInput` + the `Input` / `InputGroup` names re-exported for back-compat if needed (confirm with user during execution).
  - **Update docs subpath**: consumers currently import from `@qualcomm-ui/react-vscode/input`. Subpath changes to `@qualcomm-ui/react-vscode/text-input`. Update all demos and MDX files that import from `/input`. **Candidate breaking change — highlight in commit message.**

### 11. tabs

- **QDS ref**: `packages/frameworks/react/src/tabs/` — nested `tabs/` (tabs-root, tabs-list, tabs-panel, tabs-indicator, tabs-context) and `tab/` (tab-root, tab-button, tab-dismiss-button)
- **Current VSCode** (`src/tabs/`): `tabs.tsx` (Root), `tab-list.tsx`, `tab.tsx`, `tab-label.tsx`, `tab-panel.tsx`, `index.ts`, `vs-tabs.css`.
- **Operations**:
  - **Create**: `tabs-indicator.tsx`, `tabs-context.tsx`, `tab-dismiss-button.tsx`.
  - **Modify**: `index.ts` — export new parts + add `Tabs` namespace object (already exports `Tabs` as the Root function; the namespace object will need a slightly different shape — pick `Tabs.Root` / `Tabs.List` / `Tabs.Panel` / `Tabs.Indicator` / `Tabs.Context` and `Tab.Root` / `Tab.Button` / `Tab.DismissButton` / `Tab.Label` per QDS's two-namespace pattern).
  - **Rename**: `tabs.tsx` → `tabs-root.tsx` to match QDS filename convention; re-export `TabsRoot` as `Tabs.Root`.
  - **Modify**: `tab.tsx` → `tab-root.tsx` plus `tab-button.tsx`. Current `tab.tsx` bundles root + button. Split to match QDS.
- **CSS**: add `.vs-tabs__indicator`, `.vs-tabs__tab-dismiss-button` if needed.

### 12. option (kept)

- **Current VSCode**: `src/option/option.tsx` (native `<option>` wrapper). No changes.
- The new Select compound (see #4) ships its own `SelectItem` built on `CoreSelect.Item`. Consumers who want a native `<select><option>` continue using `Option`.
- **Note**: the existing `DropdownShowcaseDemo` places `<Option>` inside `<DropdownContent>`. That usage is semantically wrong (Option is for native selects). The demo migration in #4 replaces those with `<SelectItem>`.

## Key files & references

### Source of truth for "how each part looks"

- `packages/frameworks/react/src/menu/` — compound reference
- `packages/frameworks/react/src/tooltip/tooltip.tsx` — Simple API with render-prop trigger
- `packages/frameworks/react/src/checkbox/checkbox.tsx` — Simple API with id-wiring
- `packages/frameworks/react/src/progress/progress.tsx` — Simple API with optional children sections
- `packages/frameworks/react/src/popover/` — popover compound (the model for new `popover/` and the expanded `dropdown/`)
- `packages/frameworks/react/src/select/` — select compound
- `packages/frameworks/react/src/text-input/` — text-input compound

### Shared utilities (already in use)

- `@qualcomm-ui/utils/merge-props` — `mergeProps` for combining bindings
- `@qualcomm-ui/react-core/system` — `PolymorphicElement`, `ElementRenderProp`, `BindingRenderProp`, `bindingRenderProp`
- `@qualcomm-ui/react-core/state` — `useControlledId`
- `@qualcomm-ui/react-core/machine` — `useOptionalContentId`, `normalizeProps`
- `@qualcomm-ui/react-core/effects` — `useOnDestroy`
- `@qualcomm-ui/react-core/portal` — `Portal`
- `@qualcomm-ui/core/<component>` — typed API props, state machines, prop splitters (e.g., `splitMenuItemProps`, `splitPresenceProps`)

### VSCode-specific

- `packages/frameworks/react-vscode/src/shared/shared-classes.ts` — shared VS Code class helpers; use `sharedClasses.disabled(disabled)` where applicable
- `packages/frameworks/react-vscode/src/icon/` — `Icon`, `IconOrElement`, `CodiconOrElement` type — for `startIcon`/`endIcon` props that take a codicon string or a React element
- `packages/common/tailwind-plugin/src/qui-vscode.css` — VS Code CSS source (generated; verify if it is generated or hand-edited before adding classes)

## Suggested execution order

Dependency-aware sequence. Each is an independent commit.

1. **checkbox** — smallest delta (2 new parts + Simple API extension). Establishes the "hint/error-text" pattern.
2. **progress** — similar (3 new parts + Simple extension). Builds confidence in the namespace-export pattern.
3. **progress-circle** — reuses insights from (2).
4. **tabs** — moderate (2 new parts + 1 file split + namespace).
5. **stepper (steps)** — several new parts; expands the namespace export pattern.
6. **tooltip** — first compound split; reshapes Simple API.
7. **popover (new)** — establishes popover compound template.
8. **overlay-panel removal** — straightforward after `popover` exists.
9. **menu** — large delta; rebuild on `react-core/menu`. Benefits from experience of all prior steps.
10. **select (rename from dropdown)** — largest state-machine change; rebuild on `react-core/select`.
11. **text-input (rename from input)** — subpath rename; done last to keep other work unaffected by the rename.

Earlier steps also serve as models for later. If something unexpected surfaces (e.g., `CoreProgress.Hint` signature looks different from what we expect), resolve it in step 1-2 before committing the pattern into 9 more components.

## Verification

After each component:

1. **Type check**: `pnpm --filter @qualcomm-ui/react-vscode build:ts`
2. **Lint**: `pnpm --filter @qualcomm-ui/react-vscode lint`
3. **Build**: `pnpm --filter @qualcomm-ui/react-vscode build`
4. **Visual check**: run the docs site `pnpm --filter @qualcomm-ui/react-vscode-docs dev`, open each affected component page, confirm no visual regression.
5. **Usage check**: `grep -r "@qualcomm-ui/react-vscode" packages/` to catch broken imports, especially after rename work (overlay-panel removal, input → text-input).
6. **Consumer demos**: for any component with an existing `_<name>.mdx` demo in `packages/docs/react-vscode-docs/src/routes/components+/<name>+/demos/`, open the demo and confirm the new API surface is wired up correctly in at least one demo. Update demos to use Simple API where idiomatic; keep one compound-API demo per component so the full surface is exercised.

After the final commit:

1. `pnpm --filter @qualcomm-ui/react-vscode build && pnpm --filter @qualcomm-ui/react-vscode-docs build` — full clean build.
2. Visual sweep of the docs site once more — all 22 (formerly 23 minus overlay-panel, plus select) component pages.
3. Confirm no remaining `grep -r "OverlayPanel"` hits anywhere in `packages/`.

## Open items surfaced during planning

- **`vs-text-input.css` vs `vs-input.css`**: confirm with the user whether to rename the class prefix to `.vs-text-input` or keep `.vs-input` for back-compat. Default: rename.
- **`progress-circle-context.ts`**: verify whether the existing local ring-sizing context should become the new `ProgressCircleContext` or whether QDS's `progress-ring-context.tsx` (which wraps `CoreProgress.Context`) is a better model.
- **`vs-dropdown` → `vs-select` class rename**: confirm whether to rename the CSS prefix. Default: rename to match the component rename. Legacy `.vs-dropdown` rules get removed from the generated CSS after the source changes.
- **Tabs namespace split** (`Tabs.*` vs `Tab.*`): mirror QDS's two-namespace pattern, or collapse into one? QDS splits them, so this plan splits them. If VS Code prefers a single namespace, adjust.
- **`SelectValueText` vs a `value` prop on `SelectControl`**: QDS uses a separate `SelectValueText` part so callers can place the value anywhere. The VSCode `SelectControl` has always rendered its value *inline* (the old `DropdownInput` had a `value` prop). Decide: expose a dedicated `SelectValueText` part **and** have the Simple API render `<SelectControl><SelectValueText /><ChevronIcon /></SelectControl>`, or fold the value rendering into `SelectControl` directly. Default: follow QDS — `SelectControl` renders its `children`, and the Simple API composes `<SelectControl><SelectValueText placeholder={placeholder} /><ChevronIcon /></SelectControl>`.
