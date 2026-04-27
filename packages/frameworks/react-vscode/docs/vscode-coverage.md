# VSCode Design System Coverage for react-vscode

## Purpose

This document catalogs the webview-relevant subset of VSCode's design system (base UI primitives + theme tokens) and reports react-vscode's current coverage. It is a roadmap for closing gaps — not a style guide and not an API reference.

Motivating concern: VSCode's Figma file is incomplete, and token coverage there likely does not reflect what VSCode actually ships. This document works from authoritative source (the VSCode repository) rather than Figma.

## How to read this document

- **Components** section: one entry per in-scope VSCode base UI primitive. Each entry lists variants, states, theme tokens used, and a parity verdict against the current react-vscode component.
- **Design tokens** section: three audits, in descending priority — runtime correctness of `--vscode-*` references in react-vscode CSS, domain coverage, and `dark-modern.css` drift (dev-experience only).
- **Appendix**: primitives and token domains explicitly excluded from scope, plus open questions raised during the analysis.
- **Parity verdicts**: `complete`, `partial`, `missing`, or `in-flux`. `in-flux` defers to `docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md`.

## Methodology

Sources:

- VSCode primitives: `/Users/rbower/code/vscode/src/vs/base/browser/ui/<primitive>/`
- Theme token registry: `/Users/rbower/code/vscode/src/vs/platform/theme/common/colorRegistry.ts` plus domain-specific registry files
- Canonical Dark Modern values: `/Users/rbower/code/vscode/extensions/theme-defaults/themes/dark_modern.json`
- react-vscode source: `packages/frameworks/react-vscode/src/`
- Docs-site theme shim: `packages/docs/react-vscode-docs/src/themes/dark-modern.css`

For each primitive: (1) read `index.ts` + main `.ts`, (2) read all `.css` files, (3) record variants/states from class selectors and API surface, (4) cross-reference `colorRegistry.ts` for tokens keyed to the primitive, (5) locate react-vscode equivalent and check against the refactor spec. Source ambiguity is recorded as `unclear` and surfaced in `Open questions`.

For tokens: every `var(--vscode-*)` in react-vscode CSS is verified against `colorRegistry.ts`. In-scope domains are enumerated from the registry; tokens present in the domain but unreferenced by react-vscode are coverage suggestions, not hard gaps. `dark-modern.css` is diffed against `colorRegistry.ts` and `dark_modern.json` for dev-experience drift only.

## Components

### actionbar

**Source**: `src/vs/base/browser/ui/actionbar/`
**Purpose**: A horizontal (or vertical) row of `IAction` items rendered as `<li>` elements inside a `<ul role="toolbar">`. Each item is an `IActionViewItem` — by default an `ActionViewItem` wrapping an `<a>` with an icon and/or label. `ActionBar` manages keyboard navigation (arrow keys, Home/End), focus tracking, and an optional `IActionViewItemProvider` for custom item rendering. `Separator` is rendered as a 1 px vertical rule (horizontal in vertical mode). The `highlight-toggled` mode adds a background to checked/pressed items.

#### Variants

- Horizontal (default): `.monaco-action-bar` with `.actions-container` as a flex row.
- Vertical: `.monaco-action-bar.vertical` — `.action-item` laid out as block; separators become horizontal rules.
- With separator: `.action-label.separator` — 1 px vertical rule (or horizontal rule in vertical mode).
- `highlight-toggled`: `.actions-container.highlight-toggled` — toggled/checked items receive a highlighted background (not a dedicated CSS class; consuming contexts apply the background).
- Select container: `.action-item.select-container` — a `SelectBox` embedded inside the action bar (flex 1, max-width 170 px).
- Dropdown item: `.action-item.action-dropdown-item` — a primary action button + separator + dropdown chevron side-by-side (`.action-dropdown-item-separator`).

#### States

- Normal action item: cursor pointer; icon/codicon 16×16 px, `border-radius: var(--vscode-cornerRadius-medium)` on `.action-label`.
- Disabled item: `.action-item.disabled` — cursor default; text label color `var(--vscode-disabledForeground)`; icon-only label at opacity 0.6.
- Focused: `ActionBar` tracks focus via `DOM.trackFocus`; individual items receive native focus ring.
- Hover on action label: `toolbar.hoverBackground` applied to `.action-label` by consuming workbench contexts (not referenced in `actionbar.css` directly).

#### Theme tokens used

- `disabledForeground` (as `var(--vscode-disabledForeground)`): text color of disabled non-icon labels. Registered in `src/vs/platform/theme/common/colors/baseColors.ts`: "Overall foreground for disabled elements."
- `menu.separatorBackground` (as `var(--vscode-menu-separatorBackground, var(--vscode-disabledForeground))`): color of the vertical separator rule and horizontal separator in vertical mode. Registered in `src/vs/platform/theme/common/colors/menuColors.ts`: "Color of a separator menu item in menus."
- `cornerRadius-medium` (as `var(--vscode-cornerRadius-medium)`): `border-radius` on `.action-label` and `.keybinding`. Platform geometry token; not a color registry entry.
- `toolbar.hoverBackground`: background on action labels when hovered (applied by consuming workbench CSS, not by `actionbar.css` itself). Registered in `src/vs/platform/theme/common/colors/editorColors.ts`: "Toolbar background when hovering over actions using the mouse."
- `toolbar.activeBackground`: background on action labels when the mouse is held (also applied only by consuming contexts). Registered in `editorColors.ts`: "Toolbar background when holding the mouse over actions."
- `toolbar.hoverOutline`: outline on action labels when hovered in high-contrast (applied only by consuming contexts). Registered in `editorColors.ts`: "Toolbar outline when hovering over actions using the mouse."

#### react-vscode status

- **Equivalent**: `none`
- **Parity**: `missing`
- **Gaps**: No react-vscode component implements a keyboard-navigable horizontal/vertical action row with `IAction`-based items, separator rules, `IActionViewItemProvider` injection, or the `highlight-toggled` checked-item style. The react-vscode `icon/` directory renders individual icon buttons but provides no action-bar container, focus management, or separator primitives.
- **Notes**: Scope decision: `actionbar` CSS is not workbench-chrome-specific. Its selectors (`.monaco-action-bar`, `.action-item`, `.action-label`) are generic and have no activityBar or panel-header coupling. The token set (`disabledForeground`, `menu.separatorBackground`, `cornerRadius-medium`) is generic. The `toolbar.*` hover tokens are applied by consuming contexts — they are not baked into `actionbar.css` itself. Therefore `actionbar` remains in scope as a navigation primitive suitable for webview use. A react-vscode equivalent would be a `<ActionBar>` or `<ToolbarRow>` compound wrapping icon-button children with arrow-key navigation and separator support.

---

### breadcrumbs

**Source**: `src/vs/base/browser/ui/breadcrumbs/`
**Purpose**: A horizontally scrollable breadcrumb trail widget (`role="list"`) where each item is a `BreadcrumbsItem` rendered into a `.monaco-breadcrumb-item` div (`role="listitem"`) with a separator icon appended. `BreadcrumbsWidget` manages focus (`focused` class), selection (`selected` class), a `DomScrollableElement` for horizontal scrolling, and the five `IBreadcrumbsWidgetStyles` color slots applied via a generated inline `<style>` element.

#### Variants

- Standard item: `.monaco-breadcrumb-item` — flex row with consumer-rendered content and a trailing separator icon (any `ThemeIcon`).
- Disabled: `.monaco-breadcrumbs.disabled` — cursor default on all items; hover foreground not applied.
- First item: `.monaco-breadcrumb-item:first-of-type::before` — a single space content (leading padding).

#### States

- Normal: items rendered with `breadcrumbsForeground` as their `color`.
- Hovered (enabled): `.monaco-breadcrumbs:not(.disabled) .monaco-breadcrumb-item:hover:not(.focused):not(.selected)` — color set to `breadcrumbsHoverForeground`.
- Focused: `.monaco-breadcrumb-item.focused` — color set to `breadcrumbsFocusForeground`; item receives `node.focus()`.
- Focused and selected: `.monaco-breadcrumb-item.focused.selected` — color set to `breadcrumbsFocusAndSelectionForeground`.
- Disabled: `.monaco-breadcrumbs.disabled .monaco-breadcrumb-item` — cursor default; hover foreground suppressed.

#### Theme tokens used

Registered in `src/vs/platform/theme/common/colors/editorColors.ts`:

- `breadcrumb.foreground`: default text color of breadcrumb items. "Color of focused breadcrumb items." (transparent fraction of `foreground`, ~80% opacity)
- `breadcrumb.background`: background fill of the breadcrumb bar. "Background color of breadcrumb items." (delegates to `editorBackground`)
- `breadcrumb.focusForeground`: text color of the focused item. "Color of focused breadcrumb items." (lightened/darkened `foreground` by theme)
- `breadcrumb.activeSelectionForeground`: text color of the focused + selected item. "Color of selected breadcrumb items." (same defaults as `focusForeground`)
- `breadcrumbPicker.background`: background of the breadcrumb item picker overlay (e.g. `BreadcrumbsPicker` widget in the workbench). "Background color of breadcrumb item picker." (delegates to `editorWidgetBackground`)
- `breadcrumb.foreground` (as `breadcrumbsHoverForeground` slot in `IBreadcrumbsWidgetStyles`): hover text color — the workbench wires this slot to `breadcrumb.focusForeground` via `defaultStyles.ts`.

#### react-vscode status

- **Equivalent**: `none`
- **Parity**: `missing`
- **Gaps**: No react-vscode component renders a horizontal scrollable breadcrumb trail with focus/selection state management, a `ThemeIcon` separator between items, and the five `breadcrumb.*` color slots. The `breadcrumbPicker.background` overlay (the floating item picker that opens when a breadcrumb is clicked in VSCode's editor) is also absent.
- **Notes**: `BreadcrumbsWidget` is designed specifically for the VSCode editor navigation bar (file path + symbol hierarchy). Its five color slots correspond directly to the `breadcrumb.*` token domain, which has no overlap with other widget domains. A webview panel that needs a file-path or hierarchy navigation strip could use this primitive as the basis for a react-vscode `Breadcrumbs` compound. The `breadcrumbPicker` overlay (a separate `QuickPick`-style widget used in the workbench) is workbench-specific and not needed for a standalone breadcrumbs component.

### button

**Source**: `src/vs/base/browser/ui/button/`
**Purpose**: A clickable button element (`<a role="button">`) with primary and secondary style variants, an optional short-label slot, icon support, markdown label rendering, a checked/pressed toggle state, and a `ButtonWithDropdown` compound that pairs a primary action with a dropdown chevron.

#### Variants

- Default (primary): `.monaco-text-button` — blue background (`button.background`), white foreground (`button.foreground`).
- `secondary`: `.monaco-button.secondary` — uses `button.secondaryBackground`, `button.secondaryForeground`.
- `small`: `.monaco-text-button.small` — reduced font (11px) and padding (3px/6px).
- With short label: `.monaco-text-button-with-short-label` — wraps a visible label and a collapsed short label for narrow containers.
- `ButtonWithDropdown`: `.monaco-button-dropdown` — primary `Button` + separator + dropdown `Button` (chevron icon, `aria-haspopup`).
- `ButtonWithDescription`: `.monaco-description-button` — stacked layout with a primary button and an italic description div below it.
- `ButtonWithIcon`: `.monaco-icon-button` — separate icon element (`<i>`) and markdown label element side by side.

#### States

- Normal: background/foreground from `IButtonStyles`.
- Hover: background switches to `buttonHoverBackground` / `buttonSecondaryHoverBackground` (`.default-colors` variant applies via CSS variables; inline-style variant applies via JS `updateStyles(true)`).
- Focus: `outline-offset: 2px` on the element; no background change at CSS level (JS focus tracker calls `updateStyles(true)`).
- Disabled: `.disabled` class — `opacity: 0.4`, `cursor: default`, `aria-disabled="true"`.
- Checked/pressed: `.checked` class + `aria-pressed="true"`.
- Dropdown open: `aria-expanded="true"` on the dropdown chevron button.

#### Theme tokens used

All registered in `src/vs/platform/theme/common/colors/inputColors.ts`:

- `button.foreground`: text color of primary button. "Button foreground color."
- `button.background`: fill color of primary button. "Button background color."
- `button.hoverBackground`: primary button hover fill. "Button background color when hovering."
- `button.border`: border color (defaults to `contrastBorder`; transparent in standard themes). "Button border color."
- `button.separator`: separator bar color in `ButtonWithDropdown`. "Button separator color." (transparent fraction of `button.foreground`)
- `button.secondaryForeground`: text color of secondary button. "Secondary button foreground color."
- `button.secondaryBackground`: fill color of secondary button. "Secondary button background color."
- `button.secondaryBorder`: border of secondary button (defaults to `contrastBorder`). "Secondary button border color."
- `button.secondaryHoverBackground`: secondary button hover fill. "Secondary button background color when hovering."

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/button/`
- **Parity**: `partial`
- **Gaps**:
  - `button.border` is not referenced in `vs-button.css`; the native button has no border rule. The `.default-colors` path in VSCode uses `var(--vscode-button-border, transparent)`, which is present in the upstream CSS but absent in react-vscode.
  - `button.separator` and the `ButtonWithDropdown` split-button layout (primary + separator + chevron) have no equivalent in react-vscode.
  - `ButtonWithDescription` (stacked icon+markdown+description) has no equivalent.
  - The `outline` variant in react-vscode uses `--vscode-tab-activeBackground` and `--vscode-tab-activeForeground` — tokens from the editor tab domain, not the button domain. This is a semantic mismatch with no VSCode upstream equivalent.
  - The `checked` / `aria-pressed` toggle state is not exposed as a prop.
  - `small` maps roughly to `size="sm"` / `size="xs"`, but react-vscode adds three sizes (`md`/`sm`/`xs`) where VSCode has only one `small` flag.
- **Notes**: The react-vscode `Button` covers the 80% case (primary, secondary, disabled, icons, sizes) adequately for webview use. The `outline` variant's use of tab tokens is a correctness concern if those tokens are not defined in the webview context.

---

### codicons

**Source**: `src/vs/base/browser/ui/codicons/`
**Purpose**: Icon font registry — delivers the Codicon TrueType font (`codicon.ttf`), declares the `@font-face` rule and base `.codicon[class*='codicon-']` CSS selector, and defines animation modifier classes (spin, disabled-opacity). Contains no interactive widget; glyph-to-class mappings are generated at runtime by `iconsStyleSheet.ts` from the `Codicon` registry in `src/vs/common/codicons.ts`.

#### Variants

- Not applicable — this is a font delivery and CSS modifier module, not a visual component.

#### States

- `.codicon-modifier-disabled`: `opacity: 0.4`.
- `.codicon-modifier-spin` (and named spin aliases): `animation: codicon-spin 1.5s steps(30) infinite` — rotating spinner.

#### Theme tokens used

- No `var(--vscode-*)` tokens are referenced in `codicon.css` or `codicon-modifiers.css`. Icon coloring is inherited from the `color` of the containing element; the `icon.foreground` token (`baseColors.ts`: "The default color for icons in the workbench.") is applied by `iconsStyleSheet.ts` at the workbench level, not within this CSS.

#### react-vscode status

- **Equivalent**: none (registry only)
- **Parity**: `n/a — registry`
- **Gaps**: none applicable. The `Codicon` TypeScript union type (`icon.types.ts`) in react-vscode enumerates all glyph names and serves as the React-side type for the icon registry. The font itself is consumed via the `.codicon codicon-<name>` class pattern shared with VSCode.
- **Notes**: react-vscode's `icon/` directory (`<Icon icon="..." />`) is the rendering layer that sits on top of the codicon font; `codicons/` is infrastructure for that font. The two primitives are complementary: `codicons` = font + class spec, `icon` = rendering component.

---

### contextview

**Source**: `src/vs/base/browser/ui/contextview/`
**Purpose**: Infrastructure primitive for rendering absolutely- or fixed-positioned overlay content with anchor tracking. `ContextView` takes a `IDelegate` that provides an anchor (an `HTMLElement`, `StandardMouseEvent`, or `{x, y}` coordinate), renders arbitrary content into a managed `<div class="context-view">`, and repositions it whenever the window scrolls or resizes. Nearly every VSCode overlay surface (menus, hover widgets, dropdowns, quick-input, context menus) renders its floating panel through a `ContextView` or `IContextViewProvider`. It is not a visual component — it provides no colors, no theming, and no interactive structure of its own.

#### Variants

- `ABSOLUTE`: `.context-view { position: absolute }` — default mode; rendered inline in the document.
- `FIXED`: `.context-view.fixed { position: fixed }` — escapes scroll containers.
- `FIXED_SHADOW` (shadow DOM): same as `FIXED` but content is rendered into a shadow DOM root for style isolation.

#### States

- Shown: `IDelegate.render()` called; content mounted into `.context-view` container.
- Hidden: `hideContextView()` called; content disposed and container cleared.
- Anchor-moved: `layout()` called on scroll/resize; container repositioned without re-rendering content.

#### Theme tokens used

- **None.** `contextview.css` contains no `var(--vscode-*)` references. The two rules it defines (`position: absolute` and `.fixed` reset) carry no color or shadow. All visual theming is the responsibility of the content rendered by the `IDelegate`.

#### react-vscode status

- **Equivalent**: none (infrastructure only)
- **Parity**: `missing`
- **Gaps**: react-vscode has no general-purpose anchor-tracking overlay primitive at the infrastructure level. Individual components (menu, tooltip, dropdown) each manage their own portal rendering via `@qualcomm-ui/react-core/popover`. The refactor spec (§5) creates a `popover/` compound that serves the generic overlay-panel use case, but it is a component — not the low-level position-calculation service that `ContextView` represents.
- **Notes**: `contextview` has no dedicated token-registry domain; its CSS defines geometry only. The lack of a registry domain is by design — VSCode treats `ContextView` as a host for other components' content, not as a styled element. The refactor spec §5 `popover` is the intended replacement for the generic overlay-panel pattern in react-vscode; there is no planned replacement for the raw positioning infrastructure.

---

### countBadge

**Source**: `src/vs/base/browser/ui/countBadge/`
**Purpose**: Renders a numeric count inside a pill-shaped badge element, with an optional hover tooltip derived from a title format string.

#### Variants

- Default (pill): rounded pill shape (`border-radius: 11px`, min-width 18 px) — the standard count badge.
- `long`: flattened rect (`border-radius: 2px`, no min-height) — used when the formatted count string overflows the pill (e.g. "1K+").

#### States

- Normal: count visible, background/foreground/border applied from `ICountBadgeStyles`.
- No explicit disabled state in the API or CSS; the badge has no interactive behavior.

#### Theme tokens used

- `badge.background`: fill color for the badge pill (`background-color`). Registered in `src/vs/platform/theme/common/colors/miscColors.ts`: "Badge background color. Badges are small information labels, e.g. for search results count."
- `badge.foreground`: text color (`color`). Same file: "Badge foreground color."
- `contrastBorder` (as `badgeBorder`): `border` color in high-contrast themes only. Applied inline via `ICountBadgeStyles.badgeBorder`; not a dedicated `badge.border` registry entry — VSCode sets it to `contrastBorder` in `defaultStyles.ts`.

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/badge/`
- **Parity**: `partial`
- **Gaps**:
  - The `long` variant (flattened rect shape with `border-radius: 2px`) is not implemented; react-vscode only has `xs`/`sm`/`md` sizes, which are padding variants, not shape variants.
  - The `primary` variant uses `--vscode-activityBarBadge-foreground` / `--vscode-activityBarBadge-background` (a workbench-level domain), while `countBadge.ts` uses the base `badge.*` domain. This is a semantic mismatch — `activityBarBadge` is a subtype specific to the activity bar, not a general-purpose badge token.
  - `badgeBorder` (high-contrast border) is not referenced in react-vscode CSS.
- **Notes**: The react-vscode `Badge` has a `secondary` variant that correctly uses `badge.foreground`/`badge.background`. The `primary` variant's use of `activityBarBadge.*` tokens is intentional by design (QDS semantic layer) but diverges from the base VSCode primitive's token domain. Open question: is `primary` → `activityBarBadge` an intentional QDS mapping or a gap?

---

### dialog

**Source**: `src/vs/base/browser/ui/dialog/`
**Purpose**: A modal dialog with a `.monaco-dialog-modal-block` backdrop, a `.dialog-shadow` container, and a `.monaco-dialog-box` content element. The `Dialog` class manages a button bar (using the `ButtonBar` primitive), an optional checkbox, optional text inputs (`InputBox`), an icon slot, a message row, optional detail text, and optional custom footer/body. Button labels and the close button are rendered via the `Button` primitive. A `DialogContentsAlignment` enum controls whether icon+message+buttons lay out horizontally or vertically.

#### Variants

- Horizontal (default): icon + message in a row; buttons below, right-aligned.
- `align-vertical`: `.monaco-dialog-box.align-vertical` — icon stacked above message; buttons stacked vertically, centered. Narrower minimum width (350 px vs. 480 px).
- `type` icons: `none | info | error | question | warning | pending` — sets the icon glyph on the `.dialog-icon` element.
- With checkbox: `checkboxLabel` option renders a `Checkbox` below the message.
- With inputs: `inputs` option renders one or more `InputBox` fields below the message.
- With custom body/footer: `renderBody` / `renderFooter` callbacks inject arbitrary HTML into dedicated row containers.
- `ButtonWithDropdown`: when `primaryButtonDropdown` is provided, the primary button is a `ButtonWithDropdown` compound (chevron + action list).

#### States

- Visible: `.monaco-dialog-box` shown; `role="dialog"`, `tabIndex=-1`, focus trapped inside.
- Hidden: `hide(this.element)` called — element set to `display:none` before `show()`.
- Dimmed backdrop: `.monaco-dialog-modal-block.dimmed` — `background: rgba(0,0,0,0.3)`.
- Focus-trapped: Tab cycling constrained to dialog; Escape triggers cancel button; Enter triggers default button.
- Button focused: `outline-offset: 2px` on `.monaco-button`; dropdown button gets `outline` via `:focus-within` on the dropdown container.

#### Theme tokens used

`IDialogStyles` is populated from `defaultDialogStyles` in `defaultStyles.ts`. The dialog box itself receives all color styling inline via JS — none of the primary color tokens appear as `var(--vscode-*)` references in `dialog.css`. The CSS file provides geometry and layout only.

`defaultDialogStyles` maps the following tokens:

- `editorWidget.background` → `dialogBackground`: `.monaco-dialog-box` fill. Registered in `editorColors.ts`: "Background color of editor widgets, such as find/replace."
- `editorWidget.foreground` → `dialogForeground`: `.monaco-dialog-box` text color. Same file: "Foreground color of editor widgets."
- `widget.shadow` → `dialogShadow`: passed to button bar and other sub-widgets. Registered in `editorColors.ts`: "Shadow color of widgets such as find/replace inside the editor."
- `widget.border` → `dialogBorder`: border applied by sub-widgets. Registered in `editorColors.ts`: "Border color of widgets such as find/replace inside the editor."
- `problemsErrorIcon.foreground` → `errorIconForeground`: error type icon color.
- `problemsWarningIcon.foreground` → `warningIconForeground`: warning type icon color.
- `problemsInfoIcon.foreground` → `infoIconForeground`: info type icon color.
- `textLink.foreground` → `textLinkForeground`: link color in message content.

CSS geometry tokens (not color — present in `dialog.css` directly):

- `var(--vscode-cornerRadius-xLarge)`: `border-radius` on `.monaco-dialog-box` and `.dialog-shadow`. Platform geometry token.
- `var(--vscode-shadow-xl)`: `box-shadow` on `.monaco-dialog-box`. Platform shadow token.
- `var(--vscode-focusBorder)`: `outline-color` on `.monaco-button-dropdown:focus-within`. Registered in `baseColors.ts`.
- `var(--monaco-monospace-font)`: `font-family` on `code` elements. Platform font token (not a color).

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/dialog/`
- **Parity**: `partial`
- **Gaps**:
  - `vs-dialog.css` uses `--vscode-editorWidget-background`, `--vscode-editorWidget-foreground` for content and `--vscode-widget-shadow` for box-shadow — these are structurally correct matches for the `dialogBackground`, `dialogForeground`, and `dialogShadow` slots. However, `--vscode-editorWidget-border` is used in `tooltip/` but not referenced for the dialog border; `widget.border` (the `dialogBorder` slot) is absent from `vs-dialog.css`.
  - `var(--vscode-cornerRadius-xLarge)` and `var(--vscode-shadow-xl)` are not applied; react-vscode uses no `border-radius` on `.vs-dialog__content` and uses `0 0 8px 2px var(--vscode-widget-shadow)` as a hand-written `box-shadow` rather than `var(--vscode-shadow-xl)`.
  - `type` icon variants (`info`, `error`, `warning`, `question`, `pending`) — the `DialogIndicatorIcon` part exists but the icon-type-to-codicon mapping has no implementation; consumers supply the icon manually.
  - `ButtonWithDropdown` primary button option has no equivalent.
  - Checkbox and input slots (optional `Checkbox` + `InputBox` inside the message row) have no equivalent parts.
  - The vertical alignment variant (`align-vertical`) has no equivalent.
  - `textLink.foreground` is not referenced in `vs-dialog.css`.
- **Notes**: The 13-part compound structure (`Root`, `Backdrop`, `Positioner`, `Content`, `Body`, `Heading`, `Description`, `IndicatorIcon`, `Footer`, `Trigger`, `CloseTrigger`, `CloseButton`, `FloatingPortal`) correctly mirrors the refactor spec's instruction that dialog is "OK as-is." The primary correctness gap is the missing `border-radius` from `cornerRadius-xLarge` and the hand-written shadow instead of `shadow-xl`. The token domain used (`editorWidget.*`) is correct.

---

### dropdown (VSCode primitive — dropdown button)

**Source**: `src/vs/base/browser/ui/dropdown/`
**Purpose**: A label-bearing trigger element (`.dropdown-label`) that shows or hides a content panel on click/keypress. `BaseDropdown` is the open/close skeleton; `DropdownMenu` extends it to show a context-menu action list via `IContextMenuProvider`. Used in toolbar action bars (the "..." overflow button, split-button chevrons, etc.). This is a **button**, not a select/value-picker — it opens a menu, not a dropdown list.

#### Variants

- `BaseDropdown`: generic show/hide wrapper — no intrinsic visual style beyond cursor:pointer on the label.
- `DropdownMenu`: adds `.active` class on the outer element while the context menu is open. Provides `IActionProvider` + `IMenuOptions` wiring.
- `DropdownWithPrimary` (from `dropdownActionViewItem.ts`): `.monaco-dropdown-with-primary` — primary action button + chevron dropdown button side-by-side (same concept as `ButtonWithDropdown` but as a toolbar action view item).

#### States

- Closed: no extra class; `dropdown-label` cursor:pointer.
- Open / active: `.active` class on `.monaco-dropdown` when context menu is showing; `aria-expanded` is not set directly by this primitive (the context menu provider manages ARIA).
- Label disabled: `.action-label.disabled` inside `.dropdown-label` — cursor:default.

#### Theme tokens used

- `var(--vscode-cornerRadius-large)`: applied to `.dropdown-menu` (`border-radius`). Not a color token; defined in the VS Code platform token set.
- `var(--vscode-shadow-lg)`: applied to `.dropdown-menu` (`box-shadow`). Platform shadow token, not in `colorRegistry.ts`.
- No `var(--vscode-*)` color tokens are referenced in `dropdown.css` itself. Foreground/background colors are inherited from the toolbar or action bar context.

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/dropdown-input/` (`DropdownInput`)
- **Parity**: `partial`
- **Gaps**:
  - `DropdownInput` is a styled trigger button (`fill` / `ghost` variants) with a chevron — visually the closest match to `BaseDropdown`'s label element. However, it has no open/close wiring of its own; it is used in combination with the separate `Dropdown` / `DropdownContent` compound.
  - `DropdownMenu`'s action-menu behavior (injecting actions via `IContextMenuProvider`) has no equivalent — that belongs to the react-vscode `menu/` component.
  - `.monaco-dropdown-with-primary` (split-button layout) has no equivalent.
  - `var(--vscode-cornerRadius-large)` and `var(--vscode-shadow-lg)` are not referenced in `vs-dropdown-input.css`. The dropdown panel styling (`vs-dropdown.css` on `DropdownContent`) uses `--vscode-editorHoverWidget-border` and `--vscode-widget-shadow`, which are different tokens from the ones VSCode uses for its dropdown menu (`shadow-lg`, `cornerRadius-large`).
- **Notes**: Per refactor spec section 4, `dropdown-input/` is absorbed into `src/select/select-control.tsx` and the standalone `DropdownInput` component is deleted. The new `SelectControl` becomes the canonical styled trigger for the select/value-picker compound. The VSCode `dropdown` button primitive concept (trigger opening an action menu) maps more closely to `react-vscode`'s `menu/` compound than to `dropdown-input/`. The token discrepancy (`widget-shadow` vs. `shadow-lg`) is worth tracking in the runtime audit.

---

### findinput

**Source**: `src/vs/base/browser/ui/findinput/`
**Purpose**: A composite find-bar widget that combines a `HistoryInputBox` (text entry with search history) with three optional toggle buttons (case-sensitive, whole-words, regex) laid out in an absolutely-positioned `.controls` panel to the right of the input. Used in the editor find widget, the panel search, and the references view. `FindInput` extends `Widget`; `ReplaceInput` (in `replaceInput.ts`) extends `FindInput` with a "preserve case" toggle.

#### Variants

- Default (no toggles): `showCommonFindToggles: false` — plain history-input with `.controls` hidden.
- With find toggles: `showCommonFindToggles: true` — case-sensitive (`codicon-case-sensitive`), whole-words (`codicon-whole-word`), regex (`codicon-regex`) toggles appear in `.controls`.
- With additional toggles: arbitrary `Toggle[]` appended to `.controls` via `setAdditionalToggles`.
- `ReplaceInput`: same as with-toggles variant, plus a "preserve case" (`codicon-preserve-case`) toggle; no dedicated CSS variant — same `.monaco-findInput` class root.
- Disabled: `.monaco-findInput.disabled` — `background-color: #E1E1E1` (light) / `#333` (dark) applied directly in CSS without a `var(--vscode-*)` reference.

#### States

- Normal: `HistoryInputBox` idle state, controls visible.
- Validated / validation message: delegates entirely to `InputBox.showMessage` / `InputBox.hideMessage` — info/warning/error border and context-view message popup.
- Option highlighted: `.monaco-findInput.highlight-0` / `.highlight-1` CSS keyframe animation flashes the controls area (`.controls`) with a yellow/white translucent background. Not theme-token driven; raw `rgba` values.
- Disabled: `.disabled` class on root; input and all toggles disabled.

#### Theme tokens used

- All input-box and input-validation tokens are inherited from the embedded `HistoryInputBox` — see `inputbox` entry.
- Toggle option tokens are inherited from the embedded `Toggle` instances — see `toggle` entry (`inputOption.activeBorder`, `inputOption.activeBackground`, `inputOption.activeForeground`, `inputOption.hoverBackground`, `focusBorder`).
- `findInput.css` itself contains **no `var(--vscode-*)` references**. The disabled state uses hard-coded `rgba` values, not theme tokens.

#### react-vscode status

- **Equivalent**: none
- **Parity**: `missing`
- **Gaps**: No react-vscode component combines a text input with case/word/regex filter toggles. The `Input` component is a bare `<input>` with no toggle affordances.
- **Notes**: `FindInput` is a specialized workbench widget (editor find bar, search panel). Whether a webview needs this composite depends on use case. If a webview needs a filterable input with toggle modifiers, the consumer would currently compose `Input` + `Checkbox` (or bare `Toggle`) manually, with no structural support from react-vscode.

---

### highlightedLabel

**Source**: `src/vs/base/browser/ui/highlightedlabel/`
**Purpose**: Renders a plain text string with arbitrary subranges highlighted as `<span class="highlight">` elements, typically driven by fuzzy-match results. Optionally renders inline Codicon icons embedded in the label text.

#### Variants

- Plain text: unhighlighted portions rendered as text nodes.
- Highlighted spans: matched ranges wrapped in `<span class="highlight">`.
- With icons: when `supportIcons` is true, inline `$(codicon-name)` syntax in the label text is rendered as icon spans via `renderLabelWithIcons`.

#### States

- No interactive states defined in the primitive itself.
- Hover tooltip: an optional `title` string triggers a managed hover widget.
- Highlighted: individual `<span class="highlight">` elements; color is set by the consuming context (list/tree/suggest widget), not by this primitive's own CSS. There is no CSS file in `src/vs/base/browser/ui/highlightedlabel/`.

#### Theme tokens used

- No tokens are referenced in a `.css` file belonging to this primitive. The `.highlight` span is intentionally unstyled at the primitive level — consuming contexts apply `list.highlightForeground`, `list.focusHighlightForeground`, or `editorSuggestWidget.highlightForeground` via their own stylesheets.
- Tokens applied by consuming contexts (illustrative, not exhaustive):
  - `list.highlightForeground`: foreground color of `.highlight` spans in list/tree contexts (quick-input palette, etc.).
  - `list.focusHighlightForeground`: foreground of `.highlight` spans when the row is focused.

#### react-vscode status

- **Equivalent**: `none`
- **Parity**: `missing`
- **Gaps**: No react-vscode component renders substring highlights. The `iconLabel` primitive (see below) embeds `HighlightedLabel` for its description and name nodes when `supportHighlights` is true, so any react-vscode equivalent of `iconLabel` would need this capability.
- **Notes**: The primitive's token dependency is entirely context-driven; a react-vscode implementation would need to consume `list.highlightForeground` from whatever list/tree context hosts it. Open question: should react-vscode implement a `HighlightedLabel` primitive for use inside future list/tree components, or treat it as an implementation detail of those components?

---

### hover (base hover widget)

**Source**: `src/vs/base/browser/ui/hover/`
**Purpose**: The base hover widget layer. `HoverWidget` renders `.monaco-hover` + `.monaco-hover-content` with an embedded `DomScrollableElement`. `HoverAction` renders `.action-container` rows in a `.hover-row.status-bar` strip for interactive actions (keybinding-labelled links). `hover.ts` defines the high-level `IHoverDelegate2` service interface and all option types (`IHoverOptions`, `IHoverPositionOptions`, `IHoverAppearanceOptions`). The workbench hover service resolves `editorHoverWidget.*` tokens inline; `HoverWidget` itself applies no color styling — it only provides the DOM skeleton and `role="tooltip"` attribute.

#### Variants

- Plain hover: `.monaco-hover` with text/markdown content.
- Code hover: `.code-hover-contents` with monospace font (`var(--monaco-monospace-font)`) and source-controlled `white-space`.
- HTML hover: `.html-hover-contents` — arbitrary HTML; no padding.
- With status bar: `.hover-row.status-bar` strip at the bottom of the hover with `HoverAction` items (icon + label + keybinding).
- Fade-in: `.monaco-hover.fade-in` — 100 ms linear opacity animation.
- Pointer style: `HoverStyle.Pointer` — anchor arrow pointing at target (controlled by the hover service, not `hoverWidget.css`).
- Compact: reduced font size and padding (controlled by the hover service via extra classes).

#### States

- Visible: `.monaco-hover` displayed at computed position.
- Hidden: `.monaco-hover.hidden { display: none }`.
- Scrollable: when content overflows, `DomScrollableElement` provides a scrollbar inside `.monaco-hover-content`.
- Action disabled: `.action-container.disabled { pointer-events: none; opacity: 0.4 }`.

#### Theme tokens used

`hoverWidget.css` contains these `var(--vscode-*)` references:

- `var(--vscode-textLink-foreground)`: color of `<a>` elements and `.icon.codicon` in the status-bar action strip. Registered in `baseColors.ts`.
- `var(--vscode-textLink-activeForeground)`: hover color of code-link `<a>` spans. Registered in `baseColors.ts`.
- `var(--vscode-hover-whiteSpace, normal)`: CSS custom property for controlling `white-space` on `.monaco-hover`. This is a layout hint injected per-hover, not a theme token from `colorRegistry.ts`.
- `var(--vscode-hover-maxWidth, 500px)`: CSS custom property for max-width on markdown hover content. Same — layout hint, not a registry color.
- `var(--vscode-hover-sourceWhiteSpace, pre-wrap)`: `white-space` for tokenized source content. Same — layout hint.
- `var(--monaco-monospace-font)`: `font-family` for `code` and `.monaco-tokenized-source`. Platform font token.

The background, foreground, and border of the hover box are applied by the workbench hover service via inline styles derived from `editorHoverWidget.*` tokens (registered in `editorColors.ts`):

- `editorHoverWidget.background`: fill color of the hover box. Delegates to `editorWidget.background`.
- `editorHoverWidget.foreground`: text color. Delegates to `editorWidget.foreground`.
- `editorHoverWidget.border`: border color. Delegates to `editorWidget.border`.
- `editorHoverWidget.statusBarBackground`: background of the status-bar action strip. Lightened/darkened fraction of `editorHoverWidget.background`.

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/tooltip/`
- **Parity**: `in-flux`
- **Gaps**: Per refactor spec section 3, `tooltip` is in-flux: the current `tooltip.tsx` (which is actually the Root only), `tooltip-trigger.tsx`, and `tooltip-content.tsx` are being split into `tooltip-root.tsx`, `tooltip-positioner.tsx`, `tooltip-arrow.tsx`, `tooltip-arrow-tip.tsx`, plus a Simple API `tooltip.tsx`. Aside from in-flux items:
  - `vs-tooltip.css` uses `--vscode-menu-background` and `--vscode-editorWidget-border` for the tooltip box. The correct tokens for a VSCode hover widget are `editorHoverWidget.background` / `editorHoverWidget.foreground` / `editorHoverWidget.border`. Using `menu.background` for a tooltip is a semantic mismatch — `menu.background` and `editorHoverWidget.background` both delegate to `editorWidget.background` by default, so they typically resolve to the same value, but they are independently overridable.
  - `vs-tooltip.css` uses `--vscode-editor-foreground` for text color rather than `editorHoverWidget.foreground` (or `editorWidget.foreground`). `editor.foreground` is the editor text color, not a widget color — in some themes these differ.
  - `textLink.foreground` / `textLink.activeForeground` (for interactive content in the status bar action strip) are not referenced in `vs-tooltip.css`.
  - The status-bar action strip (`HoverAction` / `.hover-row.status-bar`) has no equivalent.
  - The `fade-in`, `compact`, and pointer-arrow variants are not implemented.
  - `editorHoverWidget.statusBarBackground` is not referenced.
- **Notes**: The mapping of `hover/` to react-vscode `tooltip/` is the intended one — `hover.ts` / `HoverWidget` is VSCode's generic hover primitive, and react-vscode `Tooltip` is the React rendering of the same concept. The refactor spec §3 is the planned fix. After the refactor, the CSS should adopt `editorHoverWidget.background`, `editorHoverWidget.foreground`, and `editorHoverWidget.border` as its base tokens.

---

### iconLabel

**Source**: `src/vs/base/browser/ui/iconLabel/`
**Purpose**: Composite label widget that combines a leading icon (Codicon font icon or image URI), a primary label with optional highlights, an optional description, and an optional suffix. Used pervasively in VSCode's tree views, file explorers, and list rows.

#### Variants

- Icon + name: icon rendered via `::before` pseudo-element (Codicon font) or `.monaco-icon-label-iconpath` image node; name text in `.label-name`.
- Icon + name + description: description text in `.label-description` (0.9em, 0.7 opacity).
- Icon + name + description + suffix: suffix text in `.label-suffix` (0.7 opacity).
- `bold`: `.monaco-icon-label.bold` — bold weight on name and description.
- `italic`: `.monaco-icon-label.italic` — italic style on name and description.
- `strikethrough`: `.monaco-icon-label.strikethrough` — line-through on name and description.
- `deprecated`: `.monaco-icon-label.deprecated` — line-through + 0.66 opacity on the entire label.
- `nowrap`: `.monaco-icon-label.nowrap` — disables `white-space: pre` wrapping on description.
- Multiple labels: when `label` is `string[]`, each segment is rendered as a separate `.label-name` anchor with `.label-separator` between them (default `/`).

#### States

- Normal: icon + text at default opacity.
- Disabled command: `.monaco-icon-label-container.disabled` — applies `var(--vscode-disabledForeground)` to the label container.
- Selected (in list context): `.monaco-list:focus .selected .monaco-icon-label` — color forced to `inherit` to override theme color.
- Description in selected row: `.monaco-list-row.focused.selected .label-description` / `.selected .label-description` — opacity raised to 0.8.
- Light theme description: `.vs .monaco-icon-label … .label-description` — opacity raised to 0.95.
- `hideIcon`: the icon is conditionally rendered (via `extraClasses`); no dedicated CSS class — the icon `::before` pseudo-element is absent when no icon class is present on the host element.

#### Theme tokens used

- `disabledForeground`: `color` on `.monaco-icon-label-container.disabled`. Registered in `src/vs/platform/theme/common/colors/baseColors.ts`: "Overall foreground for disabled elements."
- No other `var(--vscode-*)` tokens are referenced in `iconlabel.css` itself. Icon coloring is inherited from the Codicon system (`icon.foreground` via the Codicon CSS) and from list/tree context rules.

#### react-vscode status

- **Equivalent**: `none` (the `icon/` directory only covers the icon-only case; no icon+label composition component exists)
- **Parity**: `missing`
- **Gaps**: No react-vscode component composes an icon with a primary label, description, suffix, and the full set of text variants (bold, italic, strikethrough, deprecated). This is a significant gap for tree-view and list-row use cases.
- **Notes**: `simpleIconLabel.ts` in the same directory is a simpler variant (text + inline Codicon icons, no description/suffix) and is also unimplemented. Open question: is a react-vscode `IconLabel` on the roadmap, or is this intentionally deferred as a shell-only primitive (tree views being out of scope for webview use)?

### icons

**Source**: `src/vs/base/browser/ui/icons/`
**Purpose**: Icon-picker widget infrastructure — `iconSelectBox.ts` implements a searchable grid of all registered `ThemeIcon` glyphs backed by an `InputBox` filter and a scrollable `listbox`. This directory does not define a Codicon class system or an icon registration API; that lives in `src/vs/common/codicons.ts`. The `icons/` primitive is the interactive selection UI used in settings and keybinding editors, not a general display helper.

#### Variants

- Icon grid: filterable scrollable grid of `ThemeIcon` items, each 36×36 px, `role="option"`.
- With info: when `showIconInfo` is true, a label below the grid shows the focused icon's identifier via `HighlightedLabel`.

#### States

- Normal: icons rendered as Codicon spans in a scrollable container.
- Focused item: keyboard-navigable; `aria-activedescendant` tracks current item.
- Filtered: live filter via `InputBox`; unmatched glyphs hidden, matched glyph IDs highlighted.
- No disabled state.

#### Theme tokens used

- `icon.foreground` (via Codicon CSS inheritance — no direct `var(--vscode-*)` reference in `iconSelectBox.css`): default glyph color.
- `InputBox` styles (`IInputBoxStyles`) are passed in from the caller — `iconSelectBox.ts` delegates all input token usage to the `inputbox` primitive. No independent token references in `iconSelectBox.css`.

#### react-vscode status

- **Equivalent**: none (helpers/widget only)
- **Parity**: `missing`
- **Gaps**: react-vscode has no icon-picker widget. The `<Icon>` component renders a single known Codicon; there is no searchable-picker equivalent.
- **Notes**: This primitive is workbench-specific (used in the settings editor and keybinding editor). Its absence from react-vscode is expected; webview consumers typically pick icons at build time, not at runtime. Open question: if react-vscode ever needs an icon-picker (e.g. for a settings-like panel), `IconSelectBox` is the VSCode reference.

---

### inputbox

**Source**: `src/vs/base/browser/ui/inputbox/`
**Purpose**: A single-line text input (or flexible-height `<textarea>`) with inline validation and a floating context-view message popup for info/warning/error messages. Optionally embeds an `ActionBar` of icon buttons inside the trailing edge. `HistoryInputBox` extends `InputBox` with keyboard-navigable search history.

#### Variants

- Single-line (`<input>`): default; `flexibleHeight: false`.
- Multi-line (`<textarea>`): `flexibleHeight: true`; height tracks content up to `flexibleMaxHeight`.
- With actions: optional `ActionBar` of icon buttons overlaid on the right side (`position: absolute; right: 2px`).
- `HistoryInputBox`: extends `InputBox` with `HistoryNavigator<string>` and a history-hint suffix appended to the placeholder.

#### States

- Idle: `.monaco-inputbox.idle` — border transparent (or `input.border` value if set); no validation decoration.
- Focused: `.synthetic-focus` class added to `.monaco-inputbox`; border set to `var(--vscode-focusBorder)` (applied inline via JS, not CSS variable in the CSS file itself).
- Info validation: `.monaco-inputbox.info` — border color set inline to `inputValidation.infoBorder`.
- Warning validation: `.monaco-inputbox.warning` — border set to `inputValidation.warningBorder`.
- Error validation: `.monaco-inputbox.error` — border set to `inputValidation.errorBorder`.
- Validation message popup: `.monaco-inputbox-container .monaco-inputbox-message` — floated context view with background/foreground/border from the matching validation style slot.
- Disabled: `input.disabled = true` — no dedicated CSS class; `disable()` calls `blur()` and hides any message.
- Empty input: `.input.empty` — affects `white-space: nowrap` on the textarea variant.

#### Theme tokens used

All registered in `src/vs/platform/theme/common/colors/inputColors.ts`:

- `input.background`: background fill of the input box. "Input box background."
- `input.foreground`: text color. "Input box foreground."
- `input.border`: border color (transparent by default in standard themes; `contrastBorder` in high-contrast). "Input box border."
- `input.placeholderForeground`: placeholder text color. "Input box foreground color for placeholder text."
- `inputValidation.infoBackground`: message popup background for info severity. "Input validation background color for information severity."
- `inputValidation.infoForeground`: message popup text for info severity. "Input validation foreground color for information severity."
- `inputValidation.infoBorder`: border color for info validation state. "Input validation border color for information severity."
- `inputValidation.warningBackground`: message popup background for warning severity. "Input validation background color for warning severity."
- `inputValidation.warningForeground`: message popup text for warning severity. "Input validation foreground color for warning severity."
- `inputValidation.warningBorder`: border color for warning validation state. "Input validation border color for warning severity."
- `inputValidation.errorBackground`: message popup background for error severity. "Input validation background color for error severity."
- `inputValidation.errorForeground`: message popup text for error severity. "Input validation foreground color for error severity."
- `inputValidation.errorBorder`: border color for error validation state. "Input validation border color for error severity."
- `icon.foreground` (as `var(--vscode-icon-foreground)` in `inputBox.css` line 106): color of Codicon icons in the embedded `ActionBar`. Registered in `baseColors.ts`.

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/input/` (`Input`, `InputGroup`)
- **Parity**: `in-flux`
- **Gaps**: Per refactor spec section 10, `input` is being rebuilt as `text-input` around `CoreTextInput` with a full compound API (`Root`, `Input`, `InputGroup`, `Label`, `Hint`, `ErrorText`, `ErrorIndicator`, `ClearTrigger`) and a Simple `<TextInput>`. Aside from in-flux items:
  - `input.border` is not referenced in `vs-input.css`. The current react-vscode `Input` uses `var(--vscode-focusBorder)` only on `:focus-visible`; the idle-state `input.border` token is absent.
  - `inputValidation.*` tokens (all 9 — background/foreground/border for info/warning/error) are not referenced in `vs-input.css`. There is no validation message popup in react-vscode.
  - `icon.foreground` (for an embedded action bar) has no react-vscode equivalent.
  - The `HistoryInputBox` (keyboard-navigable search history, history-hint in placeholder) is not implemented.
  - The multi-line flexible-height textarea variant is not exposed as a prop.
  - `InputGroup` (`vs-input-group`) is a layout wrapper with no token usage; the VSCode `InputBox` has no direct structural equivalent for this (actions are embedded, not wrapped).
- **Notes**: The refactor adds `ErrorText`, `Hint`, `Label`, and `ErrorIndicator` parts which partially close the validation gap at the structural level. The `inputValidation.*` token domain should be adopted in the new `vs-text-input.css` once the refactor lands.

---

### keybindingLabel

**Source**: `src/vs/base/browser/ui/keybindingLabel/`
**Purpose**: Renders a keyboard shortcut as a sequence of styled key-cap `<span>` elements, supporting multi-chord bindings and optional highlight matches on individual modifier or key tokens.

#### Variants

- Single chord: one or more key-cap spans with separator between modifier and key.
- Multi-chord: two chord groups separated by a chord separator span (`.monaco-keybinding-key-chord-separator`, width 6 px).
- Unbound: renders a single "Unbound" key-cap when `renderUnboundKeybindings` is true and no keybinding is set.
- Highlighted key: `.monaco-keybinding-key.highlight` class applied to individual key-cap spans when a `Matches` object is provided (used in search/filter contexts).

#### States

- Normal: all key-cap spans styled with background, foreground, border, bottom-border, and shadow.
- Highlighted match: the `.highlight` class is added to matched key-cap spans; no dedicated color is set in the primitive's own CSS — consuming contexts (e.g. the quick-input palette) override it.
- No disabled state in the API or CSS.

#### Theme tokens used

- `keybindingLabel.background`: `background-color` of each key-cap span. Registered in `src/vs/platform/theme/common/colors/inputColors.ts`: "Keybinding label background color."
- `keybindingLabel.foreground`: `color` of the entire `.monaco-keybinding` container. Same file: "Keybinding label foreground color."
- `keybindingLabel.border`: `border-color` of each key-cap span. Same file: "Keybinding label border color."
- `keybindingLabel.bottomBorder`: `border-bottom-color` of each key-cap span (creates a pressed-key shadow effect). Same file: "Keybinding label border bottom color."
- `widget.shadow` (as `keybindingLabelShadow`): `box-shadow: inset 0 -1px 0 <value>` on each key-cap span. Set via `defaultStyles.ts`; not a `keybindingLabel.*` registry entry. Registered in `editorColors.ts`: "Shadow color of widgets such as find/replace inside the editor."

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/keybinding/`
- **Parity**: `partial`
- **Gaps**:
  - `keybindingLabel.border` is not referenced in react-vscode CSS (`vs-keybinding-icon.css`). The border is implied by the `border-radius: 2px` styling but no `border-color` token is applied.
  - `widget.shadow` (the `keybindingLabelShadow` slot) is not implemented; react-vscode uses a `::after` pseudo-element with `keybindingLabel.bottomBorder` for the bottom edge, but no `box-shadow` inset.
  - The multi-chord separator (`.monaco-keybinding-key-chord-separator`) and the highlighted match state (`.highlight` class on individual key spans) have no representation in the react-vscode API.
  - `renderUnboundKeybindings` / "Unbound" key-cap rendering is absent.
- **Notes**: react-vscode exposes `Keybinding` (container) and `KeybindingIcon` (individual key-cap) as separate components, which is a reasonable decomposition. The consumer is responsible for multi-chord layout.

---

### list

**Source**: `src/vs/base/browser/ui/list/`
**Purpose**: A virtually-scrolled, keyboard-navigable list of homogeneous rows with selection, filtering, and drag-and-drop.

#### Variants

- Single-selection: default mode; `multipleSelectionSupport: false`.
- Multi-selection: enabled by `multipleSelectionSupport: true`; row class `.selection-multiple` on `.monaco-list`.
- Horizontal scrolling: enabled by `horizontalScrolling: true`; rows overflow the container width.
- Dynamic row heights: enabled by `supportDynamicHeights: true`; rows are measured individually rather than sharing a fixed delegate height.
- Type-filter: enabled by `typeNavigationMode`; a filter widget overlay appears when the user types, and `.monaco-list-type-filter-message` overlays when no rows match.

#### States

- `.element-focused`: keyboard focus is on a row (active list).
- `.selection-single` / `.selection-multiple`: class on `.monaco-list` indicating selection mode in use.
- `.scrolling`: applied to rows during ballistic scroll, hiding row content temporarily to avoid jank.
- `.monaco-list-type-filter-message`: empty-results overlay rendered when the filter widget is active and no rows match.

#### Theme tokens used

From `src/vs/platform/theme/common/colors/listColors.ts` (prefix: `list.*` and `listFilterWidget.*`):

**Row states:**

- `list.focusBackground` / `list.focusForeground` / `list.focusOutline` — keyboard-focused row (active list)
- `list.focusAndSelectionOutline` — focused + selected row outline
- `list.activeSelectionBackground` / `list.activeSelectionForeground` / `list.activeSelectionIconForeground` — selected row in active list
- `list.inactiveSelectionBackground` / `list.inactiveSelectionForeground` / `list.inactiveSelectionIconForeground` — selected row in inactive list
- `list.inactiveFocusBackground` / `list.inactiveFocusOutline` — focused row in inactive list
- `list.hoverBackground` / `list.hoverForeground` / `list.hoverOutline` — pointer hover
- `list.dropBackground` / `list.dropBetweenBackground` — drag-over and between-item drop targets
- `list.selectionOutline` — selection outline (high-contrast)

**Filter / find:**

- `list.highlightForeground` / `list.focusHighlightForeground` — match highlight text
- `list.filterMatchBackground` / `list.filterMatchBorder` — filtered match cell highlight
- `listFilterWidget.background` / `listFilterWidget.outline` / `listFilterWidget.noMatchesOutline` / `listFilterWidget.shadow` — type-filter widget chrome

**Semantic row states:**

- `list.errorForeground` / `list.warningForeground` / `list.invalidItemForeground` / `list.deemphasizedForeground`

#### react-vscode status

- **Equivalent**: none
- **Parity**: `missing`
- **Notes**: No React wrapper for the VSCode `List<T>` widget exists in `packages/frameworks/react-vscode`. `List<T>` is an imperative, virtually-scrolled widget driven by renderer/delegate objects; porting it as a React component would require either a ref-forwarding imperative escape hatch or a full React-native re-implementation. The refactor spec does not scope it, so `missing` is the correct verdict. Consumers embedding webviews that need a list typically build their own `<ul>` or use the `table` compound.

---

### menu

**Source**: `src/vs/base/browser/ui/menu/`
**Purpose**: A keyboard-navigable vertical action menu. The `Menu` class extends `ActionBar` with vertical orientation, `role="menu"`, mnemonic support, touch gesture handling, submenu expansion via `SubmenuMenuActionViewItem`, and a scrollable container (`DomScrollableElement`). Menu items are `BaseMenuActionViewItem` instances (extending `BaseActionViewItem`) with optional start-icon, label, keybinding, and submenu indicator. A `MenuSeparatorActionViewItem` renders a horizontal rule. All color styling is applied inline via `getMenuWidgetCSS(IMenuStyles)` — there is no separate `.css` file for the menu container.

#### Variants

- Default action item: `.action-menu-item` — label + optional keybinding + optional submenu indicator.
- Separator: `.action-label.separator` — `border-bottom: 1px solid <separatorColor>` rule.
- Submenu item: `.monaco-submenu` nested container; `SubmenuMenuActionViewItem` renders a chevron indicator (`.submenu-indicator`).
- Checked item: `.menu-item-check` span rendered as a checkmark icon (`.codicon-menu-selection`); visible when `action.checked` is true.
- Mnemonic highlight: `<u>` wrapped around the mnemonic character within `.action-label`.

#### States

- Normal item: default foreground/background from `IMenuStyles.foregroundColor` / `backgroundColor`.
- Focused / hovered item: `.action-item.active` or mouse-over — `selectionForegroundColor` + `selectionBackgroundColor` applied; `border-radius: var(--vscode-cornerRadius-medium)`.
- Disabled item: `.action-item.disabled` — `color: var(--vscode-disabledForeground)`.
- Submenu open: submenu container appended to DOM; item remains highlighted.
- Container: `border-radius: var(--vscode-cornerRadius-large)`, `box-shadow: var(--vscode-shadow-lg, ...)`.

#### Theme tokens used

All menu color tokens are registered in `src/vs/platform/theme/common/colors/menuColors.ts`:

- `menu.foreground`: text color of menu items. "Foreground color of menu items." (delegates to `dropdown.foreground` / `selectForeground`.)
- `menu.background`: background fill of the menu container. "Background color of menu items." (delegates to `dropdown.background` / `selectBackground`.)
- `menu.selectionForeground`: text color of the selected/hovered item. "Foreground color of the selected menu item in menus." (delegates to `list.activeSelectionForeground`.)
- `menu.selectionBackground`: background of the selected/hovered item. "Background color of the selected menu item in menus." (delegates to `list.activeSelectionBackground`.)
- `menu.selectionBorder`: border of the selected item (high-contrast only). "Border color of the selected menu item." (null default.)
- `menu.separatorBackground`: separator line color. "Color of a separator menu item in menus." (`var(--vscode-menu-separatorBackground)` in generated CSS, `disabledForeground` at 0.2 opacity default.)
- `menu.border`: border of the menu container (high-contrast only; falls back to `editorWidget.border`). "Border color of menus."

Additional tokens applied via `IMenuStyles`:

- `widget.shadow` → `IMenuStyles.shadowColor`: `box-shadow` on the container. Registered in `editorColors.ts`.
- `disabledForeground`: color on `.action-item.disabled`. Registered in `baseColors.ts`.

CSS geometry tokens (not color):

- `var(--vscode-cornerRadius-large)`: border-radius on the menu container and scroll wrapper. Platform geometry token.
- `var(--vscode-cornerRadius-medium)`: border-radius on hovered action items. Platform geometry token.
- `var(--vscode-shadow-lg)`: `box-shadow` on the menu container (augmented by `shadowColor` if set). Platform shadow token.

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/menu/`
- **Parity**: `in-flux`
- **Gaps**: Per refactor spec section 1, `menu` is in-flux: the entire compound is being rebuilt on `react-core/menu` (`useMenu`, `useMenuItem`) instead of `react-core/popover`. Aside from in-flux items:
  - `vs-menu.css` uses `--vscode-menu-background`, `--vscode-menu-foreground`, `--vscode-menu-selectionBackground`, `--vscode-menu-selectionForeground` — the correct `menu.*` token domain. However, `menu.border` is absent (current CSS uses `--vscode-editorHoverWidget-border` for the menu container border, which is the wrong domain).
  - `--vscode-widget-shadow` is used rather than the correct `widget.shadow` token (the variable names differ: `widget.shadow` maps to `--vscode-widget-shadow`, so this is effectively correct — but the menu's `shadowColor` slot actually maps to `widget.shadow`, confirming it is correct here).
  - `menu.selectionBorder` (high-contrast only) is not referenced.
  - `menu.separatorBackground` is referenced in `vs-menu.css` (`background: var(--vscode-menu-separatorBackground)`) for a separator `<hr>` element. No dedicated `<MenuSeparator>` component part is exported, so the CSS rule exists but there is no API surface for it.
  - `disabledForeground` is not applied via a CSS variable; react-vscode uses `opacity: 0.4` and `pointer-events: none` on `.state-disabled` instead.
  - The current `MenuItem` is a bare styled `<button role="menuitem">` with no state-machine wiring (`useMenuItem` / `splitMenuItemProps` / `MenuItemContextProvider`). Arrow-key navigation, auto-close, typeahead, submenu expansion, checked/radio items, and item groups are all absent.
  - `var(--vscode-cornerRadius-large)` / `var(--vscode-cornerRadius-medium)` are not applied; react-vscode uses a hard-coded `border-radius: 4px` on `.vs-menu-item`.
- **Notes**: The token domain for foreground/background/selection is correct. The primary correctness issues are the wrong border token (`editorHoverWidget-border` instead of `menu-border` or `editorWidget-border` as the fallback) and the missing state-machine wiring. Both are addressed by the refactor spec §1.

---

### progressbar

**Source**: `src/vs/base/browser/ui/progressbar/`
**Purpose**: A thin horizontal bar that signals ongoing work, supporting both discrete (percentage-based) and infinite (indeterminate) animation modes.

#### Variants

- Discrete: fills from left to right as `worked` / `total` values are updated; drives `aria-valuenow` and `aria-valuemax`.
- Infinite: animates a sliding 2%-wide segment across the full width; switches to a `steps(100)` timing function after 10 s (`infinite-long-running`) to reduce GPU pressure.

#### States

- Hidden: bar element is removed from view; `show()` / `hide()` toggle visibility with an optional delay.
- Active: `.active` class applied while any progress mode is running.
- Done: `.done` class triggers a completion animation (width → 100% for discrete, opacity fade-out for infinite) before resetting.

#### Theme tokens used

Registered in `src/vs/platform/theme/common/colors/miscColors.ts`:

- `progressBar.background`: fill color of the progress indicator bit. Defaults to `#0E70C0` in both dark and light themes; maps to `contrastBorder` in high-contrast themes.

#### react-vscode status

- **Equivalent**: `progress`
- **Parity**: `in-flux`
- **Gaps**: The react-vscode `progress` compound wraps `@qualcomm-ui/react-core/progress` and applies a `vs-progress` class. Active refactor work (spec section 7) is reshaping the component API; current parity cannot be fully evaluated until that work stabilises.
- **Notes**: `progress-circle` is a separate react-vscode component with no corresponding VSCode base primitive; it is not audited here.

---

### radio

**Source**: `src/vs/base/browser/ui/radio/`
**Purpose**: A segmented button bar (`role="radio"`) where each item is a `Button` instance styled as a tab-stop. Exactly one item is active at a time; clicking an item fires `onDidSelect` with the item index. The `.previous-active` class on the button immediately before the active one removes its right border to create a seamless pressed-segment appearance.

#### Variants

- Single-segment: degenerate; works but offers no visual choice.
- Multi-segment: the typical usage — 2+ buttons in a horizontal strip with shared borders.
- With icon: `IRadioOptions.activeIcon` (a `ThemeIcon`) can be set; displayed via `supportIcons: true` on each `Button`. Per the API, `activeIcon` appears to be reserved for future use — `radio.ts` accepts it but does not visibly apply it to the active button in the current implementation.

#### States

- Inactive segment: no `.active` class — uses `radio.inactiveBackground`, `radio.inactiveForeground`, `radio.inactiveBorder`.
- Active segment: `.active` class — uses `radio.activeBackground`, `radio.activeForeground`, `radio.activeBorder`; also matched by `:hover` so hover on active = same style.
- Inactive hover: no `.active` — uses `radio.inactiveHoverBackground`.
- Previous-active: `.previous-active` — left border removed to merge visually with the active segment.
- Disabled item: `button.enabled = false` — the `Button` primitive handles opacity/cursor.
- High-contrast inactive hover: `outline: 1px dashed var(--vscode-toolbar-hoverOutline)` instead of background color.

#### Theme tokens used

All registered in `src/vs/platform/theme/common/colors/inputColors.ts`:

- `radio.activeForeground`: text/icon color of the active segment. "Foreground color of active radio option." (delegates to `inputOption.activeForeground`)
- `radio.activeBackground`: background of the active segment. "Background color of active radio option." (delegates to `inputOption.activeBackground`)
- `radio.activeBorder`: border of the active segment. "Border color of the active radio option." (delegates to `inputOption.activeBorder`)
- `radio.inactiveForeground`: text/icon color of inactive segments. "Foreground color of inactive radio option." (null default — inherits)
- `radio.inactiveBackground`: background of inactive segments. "Background color of inactive radio option." (null default — transparent)
- `radio.inactiveBorder`: border of inactive segments. "Border color of the inactive radio option." (transparent fraction of `radio.activeForeground`)
- `radio.inactiveHoverBackground`: background of inactive segments on hover. "Background color of inactive active radio option when hovering." (delegates to `inputOption.hoverBackground`)
- `toolbar.hoverOutline` (via `var(--vscode-toolbar-hoverOutline)`): high-contrast hover outline on inactive segments. Registered in `src/vs/platform/theme/common/colors/miscColors.ts`.

#### react-vscode status

- **Equivalent**: none
- **Parity**: `missing`
- **Gaps**: No react-vscode component renders a segmented button bar with active/inactive segment semantics. The `Button` component covers individual button items, but there is no `Radio` compound that groups them into a single-selection strip with the correct ARIA role and border-merging layout.
- **Notes**: The VSCode `Radio` is semantically distinct from an HTML `<input type="radio">` — it is a segmented toolbar control built on `Button`, not a standard form radio input. A react-vscode equivalent would need to use `role="radiogroup"` on the container and `role="radio"` / `aria-checked` on each item, matching the VSCode primitive's intent.

---

### scrollbar

**Source**: `src/vs/base/browser/ui/scrollbar/`
**Purpose**: A custom scrollable container that overlays vertical and horizontal scrollbars — with arrow buttons, a draggable slider, and an inset shadow — on any scrollable DOM element, bypassing native OS scrollbar styling.

#### Variants

- Vertical: `VerticalScrollbar` — positioned on the right edge of the scroll container.
- Horizontal: `HorizontalScrollbar` — positioned on the bottom edge.
- Overview ruler integration: `ScrollableElement` exposes an `IOverviewRulerLayoutInfo` slot used by the Monaco editor to attach a minimap-aligned gutter.

#### States

- Visible (`.visible`): slider and track are shown at full opacity with a 100 ms fade-in.
- Invisible (`.invisible`): pointer events disabled; fades out over 800 ms when `.fade` is also present.
- Active (`.active`): slider background changes to `scrollbarSlider.activeBackground` while the user is dragging.
- Hover: slider background changes to `scrollbarSlider.hoverBackground` on pointer-over.
- Shadow: a directional box-shadow keyed on `scrollbar.shadow` renders above/left of the viewport when the content is scrolled.

#### Theme tokens used

Registered in `src/vs/platform/theme/common/colors/miscColors.ts`:

- `scrollbar.shadow`: inset shadow shown at the top or left edge when the content is scrolled.
- `scrollbar.background`: track (gutter) background; defaults to `null` (transparent).
- `scrollbarSlider.background`: slider fill in the default resting state.
- `scrollbarSlider.hoverBackground`: slider fill when the pointer is over the slider.
- `scrollbarSlider.activeBackground`: slider fill while the user drags.

#### react-vscode status

- **Equivalent**: none
- **Parity**: `missing`
- **Gaps**: No react-vscode component exposes VSCode's custom scrollbar chrome (themed track, slider, arrows, or shadow) as a composable primitive.
- **Notes**: Webviews typically rely on native browser scrollbars; VSCode's custom scrollbar is bundled into workbench-shell-specific scroll containers. Consider whether a react-vscode component is needed for webview contexts.

---

### selectBox

**Source**: `src/vs/base/browser/ui/selectBox/`
**Purpose**: A value-picker select control. On macOS uses the native `<select>` element (`SelectBoxNative`); on other platforms uses a custom-drawn dropdown list (`SelectBoxList`) with a scrollable list widget. `SelectBoxList` renders a trigger element (`.monaco-select-box`) and a floating container (`.monaco-select-box-dropdown-container`) with a list of option rows, optional detail and decorator-right slots, separator rows, and an optional description pane for markdown.

#### Variants

- Native (macOS): `SelectBoxNative` — plain `<select>` element styled with `dropdown.*` tokens via `applyStyles`.
- Custom-drawn (`SelectBoxList`): floating list container with option text, optional `detail`, optional `decoratorRight`, optional markdown description pane (`.select-box-details-pane`).
- `SeparatorSelectOption`: a visual rule row (`.option-separator`) — `::after` pseudo-element dividing line.
- With decorators: `ISelectOptionItem.decoratorRight` — right-aligned text column in each option row.
- `optionsAsChildren`: alternate rendering strategy for accessibility — not a distinct visual variant.

#### States

- Trigger closed: `.monaco-select-box` — `dropdown.background`, `dropdown.foreground`, `dropdown.border` applied via `applyStyles`.
- Trigger focused: `var(--vscode-cornerRadius-small)` on border-radius (CSS); focus border applied inline via `focusBorder`.
- Dropdown open: `.monaco-select-box-dropdown-container.visible` — `display: flex`.
- Option hovered/focused: list-level styles (from `IListStyles` — `list.hoverBackground`, `list.focusBackground`, etc.).
- Option disabled: `isDisabled: true` on `ISelectOptionItem` — rendered with reduced opacity by the list row renderer.
- Separator row: `.option-separator` — cursor default, dividing line via `::after` background `var(--vscode-menu-separatorBackground)`.

#### Theme tokens used

Registered in `src/vs/platform/theme/common/colors/inputColors.ts`:

- `dropdown.background`: background fill of the trigger and dropdown list. "Dropdown background."
- `dropdown.foreground`: text color of the trigger and option rows. "Dropdown foreground."
- `dropdown.border`: border color of the trigger (and dropdown container when it differs from background). "Dropdown border."
- `dropdown.listBackground`: background of the custom-drawn option list when it differs from `dropdown.background`. "Dropdown list background." (null in standard themes — falls back to `dropdown.background`)

Also via `ISelectBoxStyles.focusBorder` (wired to `focusBorder` in `defaultStyles.ts`), `selectListBorder` (wired to `editorWidgetBorder`) for description pane borders.

CSS references in `selectBoxCustom.css`:

- `var(--vscode-cornerRadius-large)`: dropdown container `border-radius`. Platform geometry token.
- `var(--vscode-shadow-lg)`: dropdown container `box-shadow`. Platform shadow token.
- `var(--vscode-descriptionForeground)`: color of the `decoratorRight` label in separator rows.
- `var(--vscode-menu-separatorBackground)`: `::after` dividing line color in `.option-separator` rows.

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/dropdown/` (`Dropdown`, `DropdownTrigger`, `DropdownContent`)
- **Parity**: `in-flux`
- **Gaps**: Per refactor spec section 4, `dropdown/` is being rebuilt as `select/` on `react-core/select` (`useSelect`) to gain value tracking, native-form integration (`HiddenSelect`), typeahead, and arrow-key navigation between items. Aside from in-flux items:
  - The current `Dropdown` sits on `react-core/popover` — it has open/close and positioning but no value-selection state machine.
  - `vs-dropdown.css` uses `--vscode-menu-background`, `--vscode-editorHoverWidget-border`, and `--vscode-widget-shadow`, none of which are `dropdown.*` tokens. The correct tokens (`dropdown.background`, `dropdown.foreground`, `dropdown.border`) are absent from the current CSS.
  - `dropdown.listBackground`, `dropdown.foreground`, `focusBorder`, and all option-level styles are absent.
  - `option/` (`Option`, a thin `<option>` wrapper) is a native-select utility, not a `SelectBoxList` option row — the comparison does not apply.
  - `decoratorRight`, description pane, and separator-row features have no equivalents.
- **Notes**: The refactor spec explicitly calls out that the token domain mismatch and popover-vs-select state machine divergence are the core issues. The new `select/` CSS should adopt `dropdown.background`, `dropdown.foreground`, and `dropdown.border` as the base tokens.

---

### severityIcon

**Source**: `src/vs/base/browser/ui/severityIcon/`
**Purpose**: A stateless namespace that maps a `Severity` enum value (`Ignore`, `Info`, `Warning`, `Error`) to a Codicon CSS class name, producing a color-coded icon for diagnostic severity.

#### Variants

- `Ignore` / `Info`: renders `codicon-info` with the info color.
- `Warning`: renders `codicon-warning` with the warning color.
- `Error`: renders `codicon-error` with the error color.
- (Default/unknown severity): empty class name — no icon rendered.

#### States

- No interactive states. The component is purely a CSS class generator; the color is determined by the containing context's theme tokens.

#### Theme tokens used

- `problemsErrorIcon.foreground`: color for `codicon-error` in problem-panel contexts. Registered in `src/vs/platform/theme/common/colors/editorColors.ts`: "The color used for the problems error icon." (delegates to `editorErrorForeground`.)
- `problemsWarningIcon.foreground`: color for `codicon-warning` in problem-panel contexts. Same file: "The color used for the problems warning icon." (delegates to `editorWarningForeground`.)
- `problemsInfoIcon.foreground`: color for `codicon-info` in problem-panel contexts. Same file: "The color used for the problems info icon." (delegates to `editorInfoForeground`.)
- **Note**: `severityIcon.css` scopes these tokens to specific host selectors (markers panel, editor zone widget, extensions viewlet, etc.). There is no single generic `severityIcon.*` token domain.

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/status/`
- **Parity**: `partial`
- **Gaps**:
  - react-vscode uses `notificationsErrorIcon.foreground`, `notificationsWarningIcon.foreground`, `notificationsInfoIcon.foreground` — the notifications domain — rather than the `problemsErrorIcon` / `problemsWarningIcon` / `problemsInfoIcon` domain used by `severityIcon.css`. These are distinct token domains with different default values; the correct domain depends on the rendering context.
  - The `Ignore` / default-severity case (no icon rendered) is not represented as a prop value in `StatusVariant` (`"info" | "warning" | "error"` only).
  - react-vscode `Status` renders only a bare icon (via `<Icon>`); `severityIcon.ts` is itself also just a class generator, so this is structurally equivalent — but the CSS scoping to host selectors is absent.
- **Notes**: The token domain mismatch (notifications vs. problems) is meaningful: `problemsErrorIcon.foreground` and `notificationsErrorIcon.foreground` both default to `editorErrorForeground` in the standard themes, so they often resolve to the same color in practice, but users can override them independently. The "correct" domain is context-dependent. Open question: should react-vscode expose both domains or pick one and document the choice?

---

### table

**Source**: `src/vs/base/browser/ui/table/`
**Purpose**: A virtually-scrolled table with a split-view column header on top of a `List` body.

#### Variants

- Column-resizable: the header is a split-view with sashes; each `ITableColumn` carries a `weight`, `minimumWidth`, and `maximumWidth` that govern proportional resizing.
- Hidden column: `ITableColumn.onDidChangeVisibility` allows a column to be hidden/shown at runtime.
- Inherits all `List<T>` variants (single/multi-selection, type-filter, horizontal scrolling, dynamic row heights) via `ITableOptions<TRow>` extending `IListOptions<TRow>`.

#### States

Row interaction states are inherited from `List<T>` and render identically (`.element-focused`, `.selection-single`, `.selection-multiple`, `.scrolling`). Table-specific DOM:

- `.monaco-table-tr`: each data row — a flex row of `.monaco-table-td` cells.
- `.monaco-table-th`: header cell rendered by the split-view; contains `.monaco-split-view2` sash handles.
- `var(--vscode-sash-size)`: CSS custom property used in `table.css` to size column separator sashes; a layout token, not a color.

#### Theme tokens used

From `listColors.ts` (prefix: `tree.table*` and aliased `keybindingTable.*`):

- `tree.tableColumnsBorder` — column separator between split-view cells
- `tree.tableOddRowsBackground` — odd-row stripe

Workbench-level aliases in `keybindingsEditor.ts`:

- `keybindingTable.headerBackground` → `tree.tableOddRowsBackground`
- `keybindingTable.rowsBackground` → `tree.tableOddRowsBackground`

All row interaction states (hover, selection, focus) are inherited from the `list.*` domain via `IListStyles`.

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/table/`
- **Parity**: direct
- **Gaps**:
  - The react-vscode `table` is a static HTML compound (`<Table>`, `<Thead>`, `<Tbody>`, `<Tr>`, `<Th>`, `<Td>`), not a wrapper of the VSCode `Table<TRow>` widget. It provides no virtual scrolling, no column resizing, no `ITableColumn` projection, and no selection model.
  - `vs-table.css` uses `--vscode-editor-foreground`, `--vscode-editor-background`, and `--vscode-editorWidget-border`. The correct column-border token is `--vscode-tree-tableColumnsBorder`; the current CSS uses `--vscode-editorWidget-border` for both the header and cell top borders. `--vscode-tree-tableOddRowsBackground` is unused (no odd-row stripe).
  - `--vscode-editor-background` on `<td>` is a reasonable fallback but diverges from how VSCode's own table widget applies row backgrounds — the widget applies `list.activeSelectionBackground`, `list.hoverBackground`, etc. per row state rather than a blanket editor background.
  - The refactor spec marks table "OK as-is", acknowledging it as a static layout helper rather than a full widget port.
- **Notes**: The static compound is appropriate for webview panels that render fixed data tables where virtual scrolling is not needed. The token mismatches (`editorWidget-border` vs `tree-tableColumnsBorder`) are cosmetic in most themes but become visible in high-contrast mode where border colors differ meaningfully. Fixing the border token to `--vscode-tree-tableColumnsBorder` and adding an odd-row stripe via `--vscode-tree-tableOddRowsBackground` on `tr:nth-child(odd) td` would bring the CSS into alignment with VSCode conventions.

---

### toggle

**Source**: `src/vs/base/browser/ui/toggle/`
**Purpose**: A two-state interactive control used as a toolbar filter toggle and as the underlying building block for `Checkbox` and `TriStateCheckbox`. `Toggle` renders `role="checkbox"` with a `ThemeIcon` glyph; `Checkbox` wraps `Toggle` with `codicon-check` and `checkbox.*` color styles; `TriStateCheckbox` extends `Checkbox` with a `boolean | 'mixed'` tri-state (adding `codicon-dash` for the indeterminate state).

#### Variants

- `Toggle` (filter toggle): `.monaco-custom-toggle` — 20×20 px, `border-radius: 3px`, icon-only, used in search panel and find toolbar.
- `Checkbox`: `.monaco-custom-toggle.monaco-checkbox` — 18×18 px, applies `checkbox.*` color styles, shows `codicon-check` when checked.
- `TriStateCheckbox`: same DOM as `Checkbox`; adds `boolean | 'mixed'` checked state — `codicon-dash` for indeterminate.
- `ToggleActionViewItem` / `CheckboxActionViewItem`: action-bar wrappers that bind a `Toggle` / `Checkbox` to an `IAction`.

#### States

- Unchecked: no `.checked` class, no background/border from `inputActiveOption*` styles.
- Checked: `.checked` class + `aria-checked="true"` + border from `inputActiveOptionBorder`, background from `inputActiveOptionBackground`, foreground from `inputActiveOptionForeground`.
- Hover: `background-color: var(--vscode-inputOption-hoverBackground)` on `.monaco-custom-toggle:hover`.
- High-contrast hover: `border: 1px dashed var(--vscode-focusBorder)` instead of background color.
- Disabled: `aria-disabled="true"` + `.disabled` class; `checkbox.*Disabled*` styles applied via inline JS.
- Enabled checkbox: `checkbox.background`, `checkbox.foreground`, `checkbox.border` applied inline.
- Disabled checkbox: `checkbox.disabled.background`, `checkbox.disabled.foreground` applied inline.

#### Theme tokens used

`Toggle` uses (from `IToggleStyles`, registered in `inputColors.ts`):

- `inputOption.activeBorder`: border color when checked. "Border color of activated options in input fields."
- `inputOption.activeBackground`: background when checked. "Background hover color of options in input fields." (transparent fraction of `focusBorder`)
- `inputOption.activeForeground`: foreground when checked. "Foreground color of activated options in input fields."
- `inputOption.hoverBackground`: background on hover (unchecked). "Background color of activated options in input fields." (CSS variable, `toggle.css` line 22)
- `focusBorder`: high-contrast hover border. (CSS variable, `toggle.css` line 27)

`Checkbox` additionally uses (from `ICheckboxStyles`, registered in `inputColors.ts`):

- `checkbox.background`: fill when enabled. "Background color of checkbox widget."
- `checkbox.foreground`: text/icon color when enabled. "Foreground color of checkbox widget."
- `checkbox.border`: border when enabled. "Border color of checkbox widget."
- `checkbox.disabled.background`: fill when disabled. "Background of a disabled checkbox."
- `checkbox.disabled.foreground`: text/icon color when disabled. "Foreground of a disabled checkbox."

#### react-vscode status

- **Equivalent**: `packages/frameworks/react-vscode/src/checkbox/`
- **Parity**: `in-flux`
- **Gaps**: Per refactor spec section 9, `checkbox` is in-flux: `ErrorText` and `Hint` parts and corresponding Simple API props (`hint`, `errorText`, `invalid`) are being added. Aside from in-flux items:
  - react-vscode uses `--vscode-settings-checkboxBackground`, `--vscode-settings-checkboxBorder`, `--vscode-settings-checkboxForeground` (the settings domain) in `vs-checkbox.css` instead of the base `checkbox.*` domain. These are workbench-specific overrides, not the base primitive tokens.
  - `inputOption.activeBorder`, `inputOption.activeBackground`, `inputOption.activeForeground` (the Toggle filter-mode state) have no representation in the react-vscode `Checkbox`.
  - `TriStateCheckbox` (indeterminate state via `codicon-dash`) is not exposed as a prop — react-vscode has `vs-checkbox__indeterminate-icon` CSS but the `mixed` state is not surfaced in the component API.
  - `inputOption.hoverBackground` (hover background on the toggle control) is not referenced in `vs-checkbox.css`.
- **Notes**: The token domain mismatch (settings vs. base checkbox) is the most significant correctness gap — `settings.checkboxBackground` and `checkbox.background` can diverge under user customization. `TriStateCheckbox` is likely in scope for the checkbox refactor given the existing indeterminate CSS. Open question: should the refactored checkbox adopt `checkbox.*` tokens directly, or keep `settings.checkbox*` as a QDS design decision?

---

### toolbar

**Source**: `src/vs/base/browser/ui/toolbar/`
**Purpose**: A higher-level widget built on `ActionBar` that adds a secondary overflow menu (the `ToggleMenuAction` "More Actions..." button, rendered via `DropdownMenuActionViewItem`). `ToolBar` divides actions into a primary set (shown inline) and a secondary set (always in the overflow menu); when `responsiveBehavior` is enabled, primary actions that no longer fit the container width are moved into the overflow menu at runtime via a `ResizeObserver`.

#### Variants

- Default: `.monaco-toolbar` wrapping a `.monaco-action-bar` — primary actions inline, secondary actions in an overflow dropdown (`codicon-toolbar-more`).
- Responsive (`kind: 'last'`): `.monaco-toolbar.responsive.responsive-last` — the last primary action shrinks via `flex-shrink: 1` and `min-width: var(--vscode-toolbar-action-min-width, 20px)`; others hold their width.
- Responsive (`kind: 'all'`): `.monaco-toolbar.responsive.responsive-all` — all action items shrink equally with the same `min-width` CSS variable.
- With label: `options.label: true` — action items show text labels alongside icons.
- With submenu: `SubmenuAction` items render as `DropdownMenuActionViewItem` with a chevron; no dedicated CSS class on the outer container.
- Trailing separator: `trailingSeparator: true` — a `Separator` action is appended after the primary set.

#### States

- Normal: inline primary actions rendered via the underlying `ActionBar`.
- Overflow: `.monaco-action-bar.has-overflow` — the overflow toggle button is present; class applied/removed by `updateOverflowClassName()`.
- Responsive shrink: action items receive `flex-shrink: 1` and `min-width` from `var(--vscode-toolbar-action-min-width)` (a CSS custom property set inline by `ToolBar`, not a theme token from `colorRegistry.ts`).
- No additional color states beyond what `ActionBar` provides.

#### Theme tokens used

- `var(--vscode-toolbar-action-min-width)`: CSS custom property set inline by `ToolBar` to control minimum action item width in responsive mode. This is a runtime layout variable, not a token registered in `colorRegistry.ts`.
- `toolbar.hoverBackground`, `toolbar.activeBackground`, `toolbar.hoverOutline`: hover/active/outline tokens consumed by `.action-label` in the embedded `ActionBar` (applied by consuming workbench contexts as noted in `actionbar`). Registered in `src/vs/platform/theme/common/colors/editorColors.ts`.
- **Note**: `toolbar.css` itself contains **no `var(--vscode-*)` color token references**. All color theming is inherited from the embedded `ActionBar` and the workbench-level CSS that applies `toolbar.*` tokens to `.action-label` selectors.

#### react-vscode status

- **Equivalent**: `none`
- **Parity**: `missing`
- **Gaps**: No react-vscode component composes an `ActionBar` with a secondary overflow menu, responsive shrink behavior, or a `ResizeObserver`-driven visibility controller. Individual icon buttons exist in react-vscode, but there is no `Toolbar` compound that groups them with overflow handling and keyboard navigation.
- **Notes**: `ToolBar` is a direct extension of `ActionBar` — any react-vscode `ActionBar` implementation would naturally be extended to a `ToolBar` by adding an overflow `DropdownMenu` trigger and a `ResizeObserver`. The webview applicability is broad: toolbars appear in search panels, diff editors, notebook cells, and chat interfaces — all contexts where webview panels also commonly need inline icon-button rows with overflow handling.

---

### tree

**Source**: `src/vs/base/browser/ui/tree/`
**Purpose**: A hierarchical, expandable variant of list with indent guides, sticky scroll, and a find widget.

#### Variants

- Indent guides: `renderIndentGuides` — `RenderIndentGuides.None | OnHover | Always` controls whether indent guide lines are rendered.
- Find mode: `defaultFindMode` — `TreeFindMode.Highlight | Filter` switches the find widget between highlighting matches in place and filtering the visible rows.
- Find match type: `defaultFindMatchType` — `TreeFindMatchType.Contiguous | Fuzzy` controls how search strings are matched.
- Sticky scroll: enabled by `enableStickyScroll: true`; ancestor nodes of the focused row float in a `.monaco-tree-sticky-container` overlay at the top of the viewport.
- Concrete specializations: `ObjectTree<T>`, `DataTree<TInput, T>`, and `IndexTree<T>` provide different model strategies on top of `AbstractTree`.

#### States

- `.monaco-tl-twistie.collapsed`: twistie chevron rotated to indicate a collapsed node.
- `.monaco-tl-twistie.codicon-tree-item-loading`: spinner shown while a node's children are loading asynchronously.
- `.monaco-tl-row.disabled`: row rendered with reduced opacity and no pointer interaction.
- `.monaco-tree-type-filter.disabled`: find/filter widget is hidden.
- `.monaco-tree-sticky-container` / `.monaco-tree-sticky-row`: sticky-scroll overlay elements visible when `enableStickyScroll` is active.

#### Theme tokens used

Tree inherits the full `list.*` and `listFilterWidget.*` domain via `IListStyles`. Additional tree-specific tokens from `listColors.ts` (prefix: `tree.*`):

- `tree.indentGuidesStroke` — indent guide line color (active)
- `tree.inactiveIndentGuidesStroke` — indent guide line color (inactive, 40% transparent of active)
- `tree.tableColumnsBorder` — column separator border (used when tree renders as table)
- `tree.tableOddRowsBackground` — odd-row stripe in table mode

Sticky scroll uses `treeStickyScrollBackground`, `treeStickyScrollBorder`, and `treeStickyScrollShadow` fields in `IListStyles`; these are set from workbench-level `sideBar.*` / `scrollbarSlider.*` tokens by the host rather than from a `tree.stickyScroll.*` registry namespace. There is no standalone `tree.stickyScroll.*` registration in the platform color registry.

Find widget chrome draws from `listFilterWidget.*` tokens (shared with `list`), plus `widget.border` and `widget.shadow` for the filter box frame.

#### react-vscode status

- **Equivalent**: none
- **Parity**: `missing`
- **Notes**: No React wrapper exists. Tree is explicitly listed under "Out of scope" in the refactor spec (section "Out of scope", line 84: "Additional component ports (accordion, avatar, drawer, toast, tree, etc.)"). Like `list`, `AbstractTree` is an imperative, virtually-scrolled widget with renderer/delegate objects and a model abstraction (`ITreeModel`). A React port would be a significant standalone effort. Flagging `missing` is correct.

---

## Design tokens

### CSS variables referenced by react-vscode CSS (runtime audit)

This table lists every `var(--vscode-*)` reference in `packages/frameworks/react-vscode/src/**/*.css` and whether the underlying token is defined by VSCode at runtime. A reference to an undefined token is a silent styling bug — the webview will render using the fallback (if specified) or unstyled.

`font-family`, `font-size`, and `font-weight` are not registered via `registerColor()` but are injected by VSCode's webview theming layer (`vs/workbench/contrib/webview/browser/themeing.ts`) as `vscode-font-family`, `vscode-font-size`, and `vscode-font-weight`. They are valid at runtime.

| Token | File(s) | In colorRegistry? | Fallback | Deprecated? | Notes |
|-------|---------|-------------------|----------|-------------|-------|
| `--vscode-activityBarBadge-background` | `badge/vs-badge.css` | yes | — | no | — |
| `--vscode-activityBarBadge-foreground` | `badge/vs-badge.css` | yes | — | no | — |
| `--vscode-badge-background` | `badge/vs-badge.css` | yes | — | no | — |
| `--vscode-badge-foreground` | `badge/vs-badge.css` | yes | — | no | — |
| `--vscode-button-background` | `button/vs-button.css`; `icon/vs-icon.css` | yes | — | no | — |
| `--vscode-button-border` | `steps/vs-steps.css` | yes | `transparent` | no | — |
| `--vscode-button-foreground` | `button/vs-button.css`; `steps/vs-steps.css` | yes | — | no | — |
| `--vscode-button-hoverBackground` | `button/vs-button.css` | yes | — | no | — |
| `--vscode-button-secondaryBackground` | `button/vs-button.css` | yes | — | no | — |
| `--vscode-button-secondaryForeground` | `button/vs-button.css` | yes | — | no | — |
| `--vscode-button-secondaryHoverBackground` | `button/vs-button.css` | yes | — | no | — |
| `--vscode-checkbox-foreground` | `checkbox/vs-checkbox.css` | yes | — | no | — |
| `--vscode-debugView-stateLabelForeground` | `progress/vs-progress.css` | yes | — | no | — |
| `--vscode-descriptionForeground` | `checkbox/vs-checkbox.css`; `progress/vs-progress.css`; `steps/vs-steps.css` | yes | — | no | — |
| `--vscode-dropdown-background` | `dropdown-input/vs-dropdown-input.css` | yes | — | no | — |
| `--vscode-dropdown-border` | `tabs/vs-tabs.css` | yes | `var(--vscode-tab-border)` | no | — |
| `--vscode-dropdown-foreground` | `dropdown-input/vs-dropdown-input.css` | yes | — | no | — |
| `--vscode-editor-background` | `steps/vs-steps.css`; `table/vs-table.css` | yes | — | no | — |
| `--vscode-editor-foreground` | `catalog-card/vs-catalog-card.css`; `progress-circle/vs-progress-circle.css`; `progress/vs-progress.css`; `steps/vs-steps.css`; `table/vs-table.css`; `tooltip/vs-tooltip.css` | yes | — | no | — |
| `--vscode-editor-font-family` | `menu/vs-menu.css` | yes (webview theming) | — | no | Injected by webview layer (`themeing.ts` line 85: `'vscode-editor-font-family': editorFontFamily`), not via `registerColor` |
| `--vscode-editorHoverWidget-background` | `tooltip/vs-tooltip.css` | yes | — | no | — |
| `--vscode-editorHoverWidget-border` | `dropdown/vs-dropdown.css`; `menu/vs-menu.css`; `tooltip/vs-tooltip.css` | yes | — | no | — |
| `--vscode-editorWidget-background` | `catalog-card/vs-catalog-card.css`; `dialog/vs-dialog.css` | yes | — | no | — |
| `--vscode-editorWidget-border` | `catalog-card/vs-catalog-card.css`; `table/vs-table.css`; `tooltip/vs-tooltip.css` | yes | — | no | — |
| `--vscode-editorWidget-foreground` | `dialog/vs-dialog.css` | yes | `var(--vscode-foreground)` | no | — |
| `--vscode-errorForeground` | `checkbox/vs-checkbox.css`; `progress-circle/vs-progress-circle.css`; `progress/vs-progress.css`; `status/status.css` | yes | — | no | — |
| `--vscode-focusBorder` | `button/vs-button.css`; `checkbox/vs-checkbox.css`; `disclosure/vs-disclosure.css`; `dropdown-input/vs-dropdown-input.css`; `icon/vs-icon.css`; `input/vs-input.css`; `tabs/vs-tabs.css` | yes | — | no | — |
| `--vscode-font-family` | `button/vs-button.css`; `checkbox/vs-checkbox.css`; `disclosure/vs-disclosure.css` | yes (webview theming) | — | no | Injected by webview layer, not via `registerColor` |
| `--vscode-font-size` | `checkbox/vs-checkbox.css`; `disclosure/vs-disclosure.css`; `input/vs-input.css`; `progress-circle/vs-progress-circle.css`; `progress/vs-progress.css`; `steps/vs-steps.css`; `tabs/vs-tabs.css` | yes (webview theming) | — | no | Injected by webview layer, not via `registerColor` |
| `--vscode-font-weight` | `checkbox/vs-checkbox.css` | yes (webview theming) | — | no | Injected by webview layer, not via `registerColor` |
| `--vscode-foreground` | `dialog/vs-dialog.css`; `steps/vs-steps.css`; `tabs/vs-tabs.css` | yes | — | no | Also used as fallback for `editorWidget-foreground` |
| `--vscode-icon-foreground` | `dialog/vs-dialog.css`; `disclosure/vs-disclosure.css` | yes | — | no | — |
| `--vscode-input-background` | `input/vs-input.css` | yes | — | no | — |
| `--vscode-input-foreground` | `input/vs-input.css` | yes | — | no | — |
| `--vscode-input-placeholderForeground` | `input/vs-input.css` | yes | — | no | — |
| `--vscode-keybindingLabel-background` | `keybinding/vs-keybinding-icon.css` | yes | — | no | — |
| `--vscode-keybindingLabel-bottomBorder` | `keybinding/vs-keybinding-icon.css` | yes | — | no | — |
| `--vscode-keybindingLabel-foreground` | `keybinding/vs-keybinding-icon.css` | yes | — | no | — |
| `--vscode-menu-background` | `dropdown/vs-dropdown.css`; `menu/vs-menu.css`; `overlay-panel/vs-overlay-panel.css`; `tooltip/vs-tooltip.css` | yes | — | no | — |
| `--vscode-menu-foreground` | `menu/vs-menu.css` | yes | — | no | — |
| `--vscode-menu-selectionBackground` | `menu/vs-menu.css` | yes | — | no | — |
| `--vscode-menu-selectionForeground` | `menu/vs-menu.css` | yes | — | no | — |
| `--vscode-menu-separatorBackground` | `menu/vs-menu.css` | yes | — | no | — |
| `--vscode-notificationsErrorIcon-foreground` | `status/status.css` | yes | `var(--vscode-errorForeground)` | no | — |
| `--vscode-notificationsInfoIcon-foreground` | `status/status.css` | yes | — | no | — |
| `--vscode-notificationsWarningIcon-foreground` | `status/status.css` | yes | — | no | Malformed fallback: trailing comma with no value (`var(--vscode-notificationsWarningIcon-foreground,)`). No fallback renders if the token is absent. |
| `--vscode-panel-background` | `tabs/vs-tabs.css` | yes | `#1e1e1e` | no | — |
| `--vscode-panel-border` | `tabs/vs-tabs.css` | yes | `#80808059` | no | — |
| `--vscode-panelTitle-activeBorder` | `tabs/vs-tabs.css` | yes | `#e7e7e7` | no | — |
| `--vscode-panelTitle-activeForeground` | `tabs/vs-tabs.css` | yes | `#e7e7e7` | no | Used inside a multiline `var()` as `--panel-tab-active-foreground`; workbench-chrome origin (`workbench/common/theme.ts`) |
| `--vscode-panelTitle-inactiveForeground` | `tabs/vs-tabs.css` | yes | `#e7e7e799` | no | Used inside a multiline `var()` as `--panel-tab-foreground`; workbench-chrome origin (`workbench/common/theme.ts`) |
| `--vscode-settings-checkboxBackground` | `checkbox/vs-checkbox.css` | yes | — | no | Settings-editor-scoped alias for `checkbox.background`; registered in `settingsEditorColorRegistry.ts` |
| `--vscode-settings-checkboxBorder` | `checkbox/vs-checkbox.css` | yes | — | no | Settings-editor-scoped alias for `checkbox.border`; registered in `settingsEditorColorRegistry.ts` |
| `--vscode-settings-checkboxForeground` | `checkbox/vs-checkbox.css` | yes | — | no | Settings-editor-scoped alias for `checkbox.foreground`; registered in `settingsEditorColorRegistry.ts` |
| `--vscode-sideBar-background` | `disclosure/vs-disclosure.css` | yes | — | no | — |
| `--vscode-sideBarSectionHeader-background` | `disclosure/vs-disclosure.css` | yes | — | no | — |
| `--vscode-sideBarTitle-foreground` | `disclosure/vs-disclosure.css` | yes | — | no | — |
| `--vscode-tab-activeBackground` | `button/vs-button.css` | yes | — | no | — |
| `--vscode-tab-activeForeground` | `button/vs-button.css` | yes | — | no | — |
| `--vscode-tab-border` | `tabs/vs-tabs.css` | yes | — | no | Used as fallback inside `var(--vscode-dropdown-border, var(--vscode-tab-border))` |
| `--vscode-toolbar-activeBackground` | `icon/vs-icon.css` | yes | — | no | — |
| `--vscode-toolbar-hoverBackground` | `icon/vs-icon.css` | yes | — | no | — |
| `--vscode-welcomePage-progress\.background` | `progress-circle/vs-progress-circle.css`; `progress/vs-progress.css` | yes | — | no | **Bug**: wrong variable name — token is registered as `welcomePage.progress.background` (in `gettingStartedColors.ts`) and injected as `--vscode-welcomePage-progress-background` (dot-to-dash conversion). The CSS uses escaped-dot syntax (`\.`), which never matches the injected name. Correct reference: `var(--vscode-welcomePage-progress-background)`. |
| `--vscode-welcomePage-progress\.foreground` | `progress-circle/vs-progress-circle.css`; `progress/vs-progress.css` | yes | — | no | **Bug**: same wrong variable name — token is registered as `welcomePage.progress.foreground` and injected as `--vscode-welcomePage-progress-foreground`. Escaped-dot reference never resolves. Correct reference: `var(--vscode-welcomePage-progress-foreground)`. |
| `--vscode-widget-shadow` | `dialog/vs-dialog.css`; `dropdown/vs-dropdown.css`; `menu/vs-menu.css`; `overlay-panel/vs-overlay-panel.css` | yes | — | no | — |

**Runtime-critical findings:**

- Tokens not defined in VSCode at runtime:
  - none
- Deprecated tokens in use:
  - none
- Tokens without fallbacks that are also not in registry (most dangerous — will render unstyled):
  - none
- CSS references using wrong variable name (escaped-dot syntax instead of dashed form):
  - `--vscode-welcomePage-progress\.background` — token IS registered (`welcomePage.progress.background` in `gettingStartedColors.ts`) and injected as `--vscode-welcomePage-progress-background`, but the CSS uses an escaped-dot name that never resolves. No fallback, so progress track renders unstyled. Fix: `var(--vscode-welcomePage-progress-background)`. Affected files: `progress-circle/vs-progress-circle.css`, `progress/vs-progress.css`.
  - `--vscode-welcomePage-progress\.foreground` — same issue. Token is injected as `--vscode-welcomePage-progress-foreground`. Fix: `var(--vscode-welcomePage-progress-foreground)`. Affected files: `progress-circle/vs-progress-circle.css`, `progress/vs-progress.css`.

### Domain coverage by primitive

For each domain below: **Used by primitive CSS** is `yes (<file>)` when a single CSS file references the token, `yes (multiple)` when more than one file does, and `no` otherwise. Reference status is derived from the runtime audit table above. Token keys are listed alphabetically within each domain.

**Note on `hoverWidget`**: The spec scope list includes `hoverWidget` as a domain name, but VSCode's color registry has no `hoverWidget.*` tokens. The hover widget color tokens are all registered under `editorHoverWidget.*` — the `hoverWidget` name in the spec refers to the primitive section, not a separate token namespace. Coverage is reported under `editorHoverWidget` below.

---

#### Domain: activityBarBadge

Registered in `src/vs/workbench/common/theme.ts`. Workbench-chrome domain for the activity-bar badge; react-vscode `badge/` uses it for the `primary` variant.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `activityBarBadge.background` | Activity bar badge fill | yes (`badge/vs-badge.css`) | workbench-chrome origin; used via `--vscode-activityBarBadge-background` |
| `activityBarBadge.foreground` | Activity bar badge text color | yes (`badge/vs-badge.css`) | workbench-chrome origin; used via `--vscode-activityBarBadge-foreground` |

---

#### Domain: badge

Registered in `src/vs/platform/theme/common/colors/miscColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `badge.background` | Badge fill color | yes (`badge/vs-badge.css`) | — |
| `badge.foreground` | Badge text color | yes (`badge/vs-badge.css`) | — |

---

#### Domain: breadcrumb

Registered in `src/vs/platform/theme/common/colors/editorColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `breadcrumb.activeSelectionForeground` | Focused + selected item text color | no | coverage suggestion |
| `breadcrumb.background` | Bar background fill | no | coverage suggestion |
| `breadcrumb.focusForeground` | Focused item text color | no | coverage suggestion |
| `breadcrumb.foreground` | Default item text color | no | coverage suggestion — no react-vscode breadcrumbs component |

---

#### Domain: breadcrumbPicker

Registered in `src/vs/platform/theme/common/colors/editorColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `breadcrumbPicker.background` | Breadcrumb picker overlay background | no | coverage suggestion — no picker component |

---

#### Domain: button

Registered in `src/vs/platform/theme/common/colors/inputColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `button.background` | Primary button fill | yes (multiple) | `button/vs-button.css`, `icon/vs-icon.css` |
| `button.border` | Primary button border (HC/contrast) | yes (`steps/vs-steps.css`) | absent from `vs-button.css` itself |
| `button.foreground` | Primary button text color | yes (multiple) | `button/vs-button.css`, `steps/vs-steps.css` |
| `button.hoverBackground` | Primary button hover fill | yes (`button/vs-button.css`) | — |
| `button.secondaryBackground` | Secondary button fill | yes (`button/vs-button.css`) | — |
| `button.secondaryBorder` | Secondary button border (HC/contrast) | no | coverage suggestion |
| `button.secondaryForeground` | Secondary button text color | yes (`button/vs-button.css`) | — |
| `button.secondaryHoverBackground` | Secondary button hover fill | yes (`button/vs-button.css`) | — |
| `button.separator` | Split-button separator bar color | no | coverage suggestion — no `ButtonWithDropdown` equivalent |

---

#### Domain: checkbox

Registered in `src/vs/platform/theme/common/colors/inputColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `checkbox.background` | Checkbox fill (enabled) | no | react-vscode uses `settings.checkboxBackground` alias instead |
| `checkbox.border` | Checkbox border (enabled) | no | react-vscode uses `settings.checkboxBorder` alias instead |
| `checkbox.disabled.background` | Checkbox fill (disabled) | no | coverage suggestion |
| `checkbox.disabled.foreground` | Checkbox text/icon color (disabled) | no | coverage suggestion |
| `checkbox.foreground` | Checkbox text/icon color (enabled) | yes (`checkbox/vs-checkbox.css`) | react-vscode uses `--vscode-checkbox-foreground` directly |
| `checkbox.selectBackground` | Checkbox fill when parent is selected | no | coverage suggestion |
| `checkbox.selectBorder` | Checkbox border when parent is selected | no | coverage suggestion |

---

#### Token: descriptionForeground

Registered in `src/vs/platform/theme/common/colors/baseColors.ts`: "Overall foreground for description text."

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `descriptionForeground` | Description / secondary text color | yes (multiple) | `checkbox/vs-checkbox.css`, `progress/vs-progress.css`, `steps/vs-steps.css`; cross-cutting |

---

#### Token: disabledForeground

Registered in `src/vs/platform/theme/common/colors/baseColors.ts`: "Overall foreground for disabled elements."

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `disabledForeground` | Text color for disabled elements | no | cross-cutting; referenced indirectly via `vs-checkbox.css` through `descriptionForeground` but no direct `--vscode-disabledForeground` usage |

---

#### Domain: dropdown

Registered in `src/vs/platform/theme/common/colors/inputColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `dropdown.background` | Dropdown trigger/list background | yes (`dropdown-input/vs-dropdown-input.css`) | — |
| `dropdown.border` | Dropdown trigger border | yes (`tabs/vs-tabs.css`) | used as fallback inside `var(--vscode-dropdown-border, var(--vscode-tab-border))` |
| `dropdown.foreground` | Dropdown trigger/list text color | yes (`dropdown-input/vs-dropdown-input.css`) | — |
| `dropdown.listBackground` | Option list background (if distinct) | no | coverage suggestion — `vs-dropdown.css` uses `menu.background` instead |

---

#### Domain: editorHoverWidget

Registered in `src/vs/platform/theme/common/colors/editorColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `editorHoverWidget.background` | Hover box fill | yes (`tooltip/vs-tooltip.css`) | — |
| `editorHoverWidget.border` | Hover box border | yes (multiple) | `dropdown/vs-dropdown.css`, `menu/vs-menu.css`, `tooltip/vs-tooltip.css` — wrong domain for menu/dropdown; hover widget is correct only for tooltip |
| `editorHoverWidget.foreground` | Hover box text color | no | tooltip uses `editor.foreground` instead — token mismatch |
| `editorHoverWidget.highlightForeground` | Active param in parameter hints | no | coverage suggestion |
| `editorHoverWidget.statusBarBackground` | Status-bar strip background | no | coverage suggestion — no action strip implemented |

---

#### Domain: editorWidget

Registered in `src/vs/platform/theme/common/colors/editorColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `editorWidget.background` | Widget fill (dialog, find box, etc.) | yes (multiple) | `catalog-card/vs-catalog-card.css`, `dialog/vs-dialog.css` |
| `editorWidget.border` | Widget border (HC/contrast) | yes (multiple) | `catalog-card/vs-catalog-card.css`, `table/vs-table.css`, `tooltip/vs-tooltip.css` |
| `editorWidget.foreground` | Widget text color | yes (`dialog/vs-dialog.css`) | — |
| `editorWidget.resizeBorder` | Widget resize-handle border | no | workbench-only — resize handles not applicable in webview context |

---

#### Token: errorForeground

Registered in `src/vs/platform/theme/common/colors/baseColors.ts`: "Overall foreground color for error messages."

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `errorForeground` | Error text/icon color | yes (multiple) | `checkbox/vs-checkbox.css`, `progress-circle/vs-progress-circle.css`, `progress/vs-progress.css`, `status/status.css`; cross-cutting |

---

#### Domain: extensionBadge

Registered in `src/vs/workbench/common/theme.ts`. Workbench-chrome domain for extension-view remote badges.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `extensionBadge.remoteBackground` | Remote badge fill | no | workbench-chrome origin; coverage suggestion |
| `extensionBadge.remoteForeground` | Remote badge text color | no | workbench-chrome origin; coverage suggestion |

---

#### Token: focusBorder

Registered in `src/vs/platform/theme/common/colors/baseColors.ts`: "Overall border color for focused elements."

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `focusBorder` | Focus ring border color | yes (multiple) | `button/vs-button.css`, `checkbox/vs-checkbox.css`, `disclosure/vs-disclosure.css`, `dropdown-input/vs-dropdown-input.css`, `icon/vs-icon.css`, `input/vs-input.css`, `tabs/vs-tabs.css`; cross-cutting |

---

#### Token: foreground

Registered in `src/vs/platform/theme/common/colors/baseColors.ts`: "Overall foreground color."

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `foreground` | Default text color | yes (multiple) | `dialog/vs-dialog.css`, `steps/vs-steps.css`, `tabs/vs-tabs.css`; also used as fallback for `editorWidget-foreground` in dialog; cross-cutting |

---

#### Domain: icon

Registered in `src/vs/platform/theme/common/colors/baseColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `icon.foreground` | Default icon glyph color | yes (multiple) | `dialog/vs-dialog.css`, `disclosure/vs-disclosure.css` |

---

#### Domain: input

Registered in `src/vs/platform/theme/common/colors/inputColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `input.background` | Input box fill | yes (`input/vs-input.css`) | — |
| `input.border` | Input box border (transparent in standard themes) | no | coverage suggestion — present on focus via `focusBorder` but idle `input.border` not applied |
| `input.foreground` | Input box text color | yes (`input/vs-input.css`) | — |
| `input.placeholderForeground` | Placeholder text color | yes (`input/vs-input.css`) | — |

---

#### Domain: inputOption

Registered in `src/vs/platform/theme/common/colors/inputColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `inputOption.activeBackground` | Toggle/option background when active | no | coverage suggestion — toggle active state not implemented |
| `inputOption.activeBorder` | Toggle/option border when active | no | coverage suggestion |
| `inputOption.activeForeground` | Toggle/option text color when active | no | coverage suggestion |
| `inputOption.hoverBackground` | Toggle/option background on hover | no | coverage suggestion |

---

#### Domain: inputValidation

Registered in `src/vs/platform/theme/common/colors/inputColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `inputValidation.errorBackground` | Error message popup fill | no | coverage suggestion — no validation popup in react-vscode |
| `inputValidation.errorBorder` | Error-state input border | no | coverage suggestion |
| `inputValidation.errorForeground` | Error message popup text | no | coverage suggestion |
| `inputValidation.infoBackground` | Info message popup fill | no | coverage suggestion |
| `inputValidation.infoBorder` | Info-state input border | no | coverage suggestion |
| `inputValidation.infoForeground` | Info message popup text | no | coverage suggestion |
| `inputValidation.warningBackground` | Warning message popup fill | no | coverage suggestion |
| `inputValidation.warningBorder` | Warning-state input border | no | coverage suggestion |
| `inputValidation.warningForeground` | Warning message popup text | no | coverage suggestion |

---

#### Domain: keybindingLabel

Registered in `src/vs/platform/theme/common/colors/inputColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `keybindingLabel.background` | Key-cap fill | yes (`keybinding/vs-keybinding-icon.css`) | — |
| `keybindingLabel.border` | Key-cap border | no | coverage suggestion — border-radius applied but no border-color |
| `keybindingLabel.bottomBorder` | Key-cap bottom border (pressed-key effect) | yes (`keybinding/vs-keybinding-icon.css`) | — |
| `keybindingLabel.foreground` | Key-cap text color | yes (`keybinding/vs-keybinding-icon.css`) | — |

---

#### Domain: keybindingTable

Registered in `src/vs/workbench/contrib/preferences/browser/keybindingsEditor.ts`. Workbench-only aliases for `tree.tableOddRowsBackground`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `keybindingTable.headerBackground` | Keybindings editor header row fill | no | workbench-chrome only — alias for `tree.tableOddRowsBackground` |
| `keybindingTable.rowsBackground` | Keybindings editor alternating row fill | no | workbench-chrome only — alias for `tree.tableOddRowsBackground` |

---

#### Domain: list

Registered in `src/vs/platform/theme/common/colors/listColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `list.activeSelectionBackground` | Selected row fill (active list) | no | coverage suggestion — no list component |
| `list.activeSelectionForeground` | Selected row text (active list) | no | coverage suggestion |
| `list.activeSelectionIconForeground` | Selected row icon color (active list) | no | coverage suggestion |
| `list.deemphasizedForeground` | Deemphasized item text | no | coverage suggestion |
| `list.dropBackground` | Drop-over row fill during drag | no | coverage suggestion |
| `list.dropBetweenBackground` | Between-row drop indicator color | no | coverage suggestion |
| `list.errorForeground` | Row text for items with errors | no | coverage suggestion |
| `list.filterMatchBackground` | Filtered match cell highlight fill | no | coverage suggestion |
| `list.filterMatchBorder` | Filtered match cell highlight border | no | coverage suggestion |
| `list.focusAndSelectionOutline` | Outline for focused + selected row | no | coverage suggestion |
| `list.focusBackground` | Focused row fill (active list) | no | coverage suggestion |
| `list.focusForeground` | Focused row text (active list) | no | coverage suggestion |
| `list.focusHighlightForeground` | Match highlight text on focused rows | no | coverage suggestion |
| `list.focusOutline` | Focused row outline (active list) | no | coverage suggestion |
| `list.highlightForeground` | Match highlight text color | no | coverage suggestion |
| `list.hoverBackground` | Hovered row fill | no | coverage suggestion |
| `list.hoverForeground` | Hovered row text | no | coverage suggestion |
| `list.inactiveFocusBackground` | Focused row fill (inactive list) | no | coverage suggestion |
| `list.inactiveFocusOutline` | Focused row outline (inactive list) | no | coverage suggestion |
| `list.inactiveSelectionBackground` | Selected row fill (inactive list) | no | coverage suggestion |
| `list.inactiveSelectionForeground` | Selected row text (inactive list) | no | coverage suggestion |
| `list.inactiveSelectionIconForeground` | Selected row icon (inactive list) | no | coverage suggestion |
| `list.invalidItemForeground` | Unresolved/invalid item text | no | coverage suggestion |
| `list.warningForeground` | Row text for items with warnings | no | coverage suggestion |

---

#### Domain: listFilterWidget

Registered in `src/vs/platform/theme/common/colors/listColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `listFilterWidget.background` | Type-filter widget fill | no | coverage suggestion — no list type-filter component |
| `listFilterWidget.noMatchesOutline` | Type-filter outline when no matches | no | coverage suggestion |
| `listFilterWidget.outline` | Type-filter widget outline | no | coverage suggestion |
| `listFilterWidget.shadow` | Type-filter widget shadow | no | coverage suggestion |

---

#### Domain: menu

Registered in `src/vs/platform/theme/common/colors/menuColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `menu.background` | Menu container fill | yes (multiple) | `dropdown/vs-dropdown.css`, `menu/vs-menu.css`, `overlay-panel/vs-overlay-panel.css`, `tooltip/vs-tooltip.css` |
| `menu.border` | Menu container border (HC/standard fallback) | no | coverage gap — `menu/vs-menu.css` uses `editorHoverWidget-border` instead |
| `menu.foreground` | Menu item text color | yes (`menu/vs-menu.css`) | — |
| `menu.selectionBackground` | Selected/hovered item fill | yes (`menu/vs-menu.css`) | — |
| `menu.selectionBorder` | Selected item border (HC only) | no | coverage suggestion |
| `menu.selectionForeground` | Selected/hovered item text color | yes (`menu/vs-menu.css`) | — |
| `menu.separatorBackground` | Separator rule color | yes (`menu/vs-menu.css`) | used for the separator `<hr>` background — no dedicated separator component but the CSS rule exists |

---

#### Domain: menubar

Registered in `src/vs/workbench/common/theme.ts`. Workbench title-bar menu bar — not applicable in webviews.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `menubar.selectionBackground` | Selected menu label fill | no | workbench-chrome only |
| `menubar.selectionBorder` | Selected menu label border (HC) | no | workbench-chrome only |
| `menubar.selectionForeground` | Selected menu label text | no | workbench-chrome only |

---

#### Token: notificationLink

Registered in `src/vs/workbench/common/theme.ts`: "Notification links foreground color."

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `notificationLink.foreground` | Link color in notification toasts | no | workbench-chrome origin; coverage suggestion if used for in-webview links |

---

#### Domain: notification icons

Registered in `src/vs/workbench/common/theme.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `notificationsErrorIcon.foreground` | Error icon color in notifications | yes (`status/status.css`) | — |
| `notificationsInfoIcon.foreground` | Info icon color in notifications | yes (`status/status.css`) | — |
| `notificationsWarningIcon.foreground` | Warning icon color in notifications | yes (`status/status.css`) | malformed fallback in CSS (trailing comma — no value) |

---

#### Domain: problemsErrorIcon / problemsWarningIcon / problemsInfoIcon

Registered in `src/vs/platform/theme/common/colors/editorColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `problemsErrorIcon.foreground` | Error icon in problems panel | no | coverage suggestion — react-vscode status uses `notificationsErrorIcon` instead |
| `problemsInfoIcon.foreground` | Info icon in problems panel | no | coverage suggestion |
| `problemsWarningIcon.foreground` | Warning icon in problems panel | no | coverage suggestion |

---

#### Domain: profileBadge

Registered in `src/vs/workbench/common/theme.ts`. Workbench profile-picker badge.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `profileBadge.background` | Profile badge fill | no | workbench-chrome only |
| `profileBadge.foreground` | Profile badge text color | no | workbench-chrome only |

---

#### Domain: progressBar

Registered in `src/vs/platform/theme/common/colors/miscColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `progressBar.background` | Progress indicator fill | no | coverage gap — react-vscode progress uses `welcomePage.progress.background` instead |

---

#### Domain: radio

Registered in `src/vs/platform/theme/common/colors/inputColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `radio.activeBackground` | Active segment fill | no | coverage suggestion — no radio/segmented-button component |
| `radio.activeBorder` | Active segment border | no | coverage suggestion |
| `radio.activeForeground` | Active segment text color | no | coverage suggestion |
| `radio.inactiveBackground` | Inactive segment fill | no | coverage suggestion |
| `radio.inactiveBorder` | Inactive segment border | no | coverage suggestion |
| `radio.inactiveForeground` | Inactive segment text color | no | coverage suggestion |
| `radio.inactiveHoverBackground` | Inactive segment hover fill | no | coverage suggestion |

---

#### Domain: scrollbar

Registered in `src/vs/platform/theme/common/colors/miscColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `scrollbar.background` | Scrollbar track fill | no | coverage suggestion — no custom scrollbar component |
| `scrollbar.shadow` | Shadow at scrolled-edge of content | no | coverage suggestion |

---

#### Domain: scrollbarSlider

Registered in `src/vs/platform/theme/common/colors/miscColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `scrollbarSlider.activeBackground` | Slider fill while dragging | no | coverage suggestion |
| `scrollbarSlider.background` | Slider fill at rest | no | coverage suggestion |
| `scrollbarSlider.hoverBackground` | Slider fill on hover | no | coverage suggestion |

---

#### Domain: textLink

Registered in `src/vs/platform/theme/common/colors/baseColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `textLink.activeForeground` | Link hover/active color | no | coverage suggestion — used by `hoverWidget.css` for action strip links |
| `textLink.foreground` | Hyperlink text color | no | coverage suggestion — referenced in `hoverWidget.css` and `dialog.ts` but absent from react-vscode CSS |

---

#### Domain: toolbar

Registered in `src/vs/platform/theme/common/colors/editorColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `toolbar.activeBackground` | Action label fill while mouse is held | yes (`icon/vs-icon.css`) | — |
| `toolbar.hoverBackground` | Action label fill on hover | yes (`icon/vs-icon.css`) | — |
| `toolbar.hoverOutline` | Action label outline on hover (HC) | no | coverage suggestion — high-contrast outline not applied |

---

#### Domain: tree (table and indentGuides rows only)

Registered in `src/vs/platform/theme/common/colors/listColors.ts`. Full `tree.*` domain; spec scopes this to `tree.table*` and `tree.indentGuides*` rows only — other tree tokens inherit from `list.*`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `tree.inactiveIndentGuidesStroke` | Indent guide line color (inactive) | no | coverage suggestion |
| `tree.indentGuidesStroke` | Indent guide line color (active) | no | coverage suggestion — no tree component |
| `tree.tableColumnsBorder` | Column separator border in table mode | no | coverage gap — `table/vs-table.css` uses `editorWidget-border` instead |
| `tree.tableOddRowsBackground` | Odd-row stripe in table mode | no | coverage gap — `table/vs-table.css` applies no odd-row stripe |

---

#### Domain: widget

Registered in `src/vs/platform/theme/common/colors/editorColors.ts`.

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `widget.border` | Widget border (HC/contrast themes) | no | coverage gap — dialog/menu/tooltip use `editorWidget-border` or `editorHoverWidget-border` but not `widget.border` directly |
| `widget.shadow` | Widget drop shadow | yes (multiple) | `dialog/vs-dialog.css`, `dropdown/vs-dropdown.css`, `menu/vs-menu.css`, `overlay-panel/vs-overlay-panel.css` |

### dark-modern.css drift (dev-experience only)

`dark-modern.css` is a dev-time docs-site reference (see Methodology). Drift below does not affect shipped behavior in webviews — it only changes how components render in the react-vscode-docs site.

**Missing from dark-modern.css** (docs site uses CSS fallback or default rendering):

none — all 126 tokens defined in `dark_modern.json` are present in `dark-modern.css` (after normalizing dot-vs-dash key encoding).

**Value drift** (dark-modern.css disagrees with dark\_modern.json):

6 of the 14 apparent mismatches are format-only: `rgba(r,g,b,a)` in CSS vs `#RRGGBBAA` hex in JSON that resolve to numerically equivalent colors. The 8 semantic mismatches are:

| Token | dark-modern.css | dark\_modern.json |
|-------|-----------------|------------------|
| `--vscode-button-border` | `rgba(255, 255, 255, 0.07)` | `#ffffff1a` (alpha 0.102) |
| `--vscode-button-secondaryBackground` | `#313131` | `#00000000` (transparent black) |
| `--vscode-button-secondaryHoverBackground` | `#3c3c3c` | `#2B2B2B` |
| `--vscode-chat-slashCommandBackground` | `#34414b` | `#26477866` |
| `--vscode-chat-slashCommandForeground` | `#40a6ff` | `#85B6FF` |
| `--vscode-panelTitle-activeBorder` | `#e7e7e7` | `#0078D4` |
| `--vscode-statusBarItem-hoverBackground` | `rgba(255, 255, 255, 0.12)` | `#F1F1F133` (alpha 0.200) |
| `--vscode-statusBarItem-hoverForeground` | `#cccccc` | `#FFFFFF` |

<details>
<summary>Format-only drift (numerically equivalent, different notation)</summary>

| Token | dark-modern.css | dark\_modern.json |
|-------|-----------------|------------------|
| `--vscode-editorGroup-border` | `rgba(255, 255, 255, 0.09)` | `#FFFFFF17` |
| `--vscode-inputOption-activeBackground` | `rgba(36, 137, 219, 0.51)` | `#2489DB82` |
| `--vscode-peekViewEditor-matchHighlightBackground` | `rgba(187, 128, 9, 0.4)` | `#BB800966` |
| `--vscode-peekViewResult-matchHighlightBackground` | `rgba(187, 128, 9, 0.4)` | `#BB800966` |
| `--vscode-settings-modifiedItemIndicator` | `rgba(187, 128, 9, 0.4)` | `#BB800966` |
| `--vscode-statusBarItem-prominentBackground` | `rgba(110, 118, 129, 0.4)` | `#6E768166` |

</details>

**Orphan keys** (present in dark-modern.css, not found in open-source colorRegistry — candidates for cleanup):

The 21 orphans fall into four categories:

*Font/size CSS variables (not color registry tokens — valid but outside colorRegistry scope):*

- `--vscode-font-size`
- `--vscode-font-weight`
- `--vscode-editor-font-size`
- `--vscode-editor-font-weight`

*Renamed upstream — `inlineEdit.indicator.*` was replaced by `inlineEdit.gutterIndicator.*`:*

- `--vscode-inlineEdit-border`
- `--vscode-inlineEdit-indicator\.background`
- `--vscode-inlineEdit-indicator\.border`
- `--vscode-inlineEdit-indicator\.foreground`

*Closed-source extension tokens (`remoteHub` is not in the open-source VSCode repo):*

<details>
<summary>12 remoteHub.* tokens</summary>

- `--vscode-remoteHub-decorations\.addedForegroundColor`
- `--vscode-remoteHub-decorations\.conflictForegroundColor`
- `--vscode-remoteHub-decorations\.deletedForegroundColor`
- `--vscode-remoteHub-decorations\.ignoredResourceForeground`
- `--vscode-remoteHub-decorations\.incomingAddedForegroundColor`
- `--vscode-remoteHub-decorations\.incomingDeletedForegroundColor`
- `--vscode-remoteHub-decorations\.incomingModifiedForegroundColor`
- `--vscode-remoteHub-decorations\.incomingRenamedForegroundColor`
- `--vscode-remoteHub-decorations\.modifiedForegroundColor`
- `--vscode-remoteHub-decorations\.possibleConflictForegroundColor`
- `--vscode-remoteHub-decorations\.submoduleForegroundColor`
- `--vscode-remoteHub-decorations\.workspaceRepositoriesView\.hasUncommittedChangesForegroundColor`

</details>

*Removed or not found in open-source VSCode source:*

- `--vscode-editorWatermark-foreground` — no registration found in VSCode source

**Summary**: `0` tokens missing, `8` values semantically drifted (plus `6` format-only), `21` orphans. Remediation is a follow-up; this analysis documents the current state only.

## Appendix

### Excluded shell-only primitives

| Primitive | Reason for exclusion |
|-----------|----------------------|
| `sash` | Draggable resize handle between workbench panels — not used inside webviews |
| `splitview` | Container that manages a sash and resizable children — shell-chrome geometry |
| `grid` | Higher-order layout built on `splitview` — shell-chrome geometry |
| `centered` | Centered-content wrapper for editor chrome — shell-specific layout |
| `resizable` | Low-level resize helper — shell-chrome geometry |
| `mouseCursor` | Cursor management helper — not a visual primitive |
| `dnd` (base) | Drag-and-drop event/manager layer — individual widgets that use DnD are covered in their own entries |
| `aria` | Accessibility live-region helper — not a visual primitive |
| `animations` | Animation helpers — not a visual primitive |

### Excluded token domains

| Domain | Reason for exclusion |
|--------|----------------------|
| `editor.*` | Editor chrome and editor-specific rendering — not exposed in webviews |
| `tab.*` | Editor tab strip — workbench chrome |
| `terminal.*` | Integrated terminal — not rendered in webviews |
| `notebook.*` | Notebook editor — not rendered in webviews |
| `debugTokenExpression.*` | Debug view syntax — debug-specific |
| `testing.*` | Test explorer — debug/test-specific |
| `scmGraph.*` | SCM graph view — workbench chrome |
| `mergeEditor.*` | Merge editor — editor-specific |
| `peekView.*` | Peek view widget — editor chrome |
| `symbolIcon.*` | Editor symbol icons — editor-specific |
| `chart.*` | Chart rendering in the extensions view — chrome |
| `activityBar.*` | Activity bar — workbench chrome |
| `statusBar.*` | Status bar — workbench chrome |
| `sideBar.*` | Sidebar — workbench chrome |
| `panel.*` | Bottom panel — workbench chrome |
| `titleBar.*` | Title bar — workbench chrome |
| `welcomePage.*` | Welcome page — workbench chrome |
| `quickInput.*` | Quick pick widget — workbench chrome |
| `suggestWidget.*` | Editor suggestion widget — editor chrome |

### Open questions

- **countBadge primary → activityBarBadge.* token mapping*\*: Is this intentional QDS design (activity bar as the primary badge use case), or a gap that should use `badge.*` tokens instead? — raised in `countBadge` section.
- **severityIcon token domain**: Should react-vscode `Status` use `problemsIcon.*`, `notificationsIcon.*`, or expose both? Context-dependent in VSCode. — raised in `severityIcon` section.
- **highlightedLabel as standalone vs. implementation detail**: Should react-vscode implement a `HighlightedLabel` primitive for use inside future list/tree components, or treat it as an implementation detail of those components? — raised in `highlightedLabel` section.
- **iconLabel scope**: Is a react-vscode `IconLabel` on the roadmap, or is this intentionally deferred as a shell-only primitive (tree views being out of scope for webview use)? — raised in `iconLabel` section.
- **Checkbox uses `settings.checkbox*` tokens** instead of base `checkbox.*`: intentional QDS mapping or copy error? `settings.checkboxBackground` and `checkbox.background` can diverge under user customization. — raised in `toggle`/`checkbox` sections.
- **TriStateCheckbox indeterminate state**: partial CSS support (`vs-checkbox__indeterminate-icon`) but no prop exposure — in scope for the checkbox refactor (spec §9)? — raised in `toggle`/`checkbox` sections.
- **Outline button variant uses `--vscode-tab-activeBackground`/`--vscode-tab-activeForeground`**: tab tokens may not be defined in webview contexts — needs audit. — raised in `button` section; Task 9 runtime audit did not flag these tokens as missing from `colorRegistry`, but their presence in a given webview's injected token set is context-dependent.
