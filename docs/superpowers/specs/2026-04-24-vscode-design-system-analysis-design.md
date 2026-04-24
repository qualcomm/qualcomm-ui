# VSCode Design System Analysis — Coverage Roadmap for react-vscode

## Purpose

Produce a reference document that catalogues the webview-relevant subset of VSCode's design system (UI primitives + theme tokens) so the `@qualcomm-ui/react-vscode` library has a clear, evidence-based roadmap of what still needs coverage.

The motivating concern: VSCode's Figma file is incomplete. The suspicion that token coverage in Figma is similarly incomplete led to adding a token audit alongside the component audit. The react-vscode library already ships ~25 components; this analysis identifies gaps, incompleteness, and drift so future consolidation work has an authoritative reference.

## Audience

The primary reader is the maintainer of the `@qualcomm-ui/react-vscode` library. The secondary audience is anyone deciding whether to request new Figma components or theme tokens from design.

## Deliverable

A single markdown document at:

```
packages/frameworks/react-vscode/docs/vscode-coverage.md
```

(The `docs/` subdirectory is new to the package and is created by this work.)

## Source material

- **Components**: `/Users/rbower/code/vscode/src/vs/base/browser/ui/` — every subdirectory is an in-scope candidate unless explicitly filtered out.
- **Theme tokens (authoritative)**: `/Users/rbower/code/vscode/src/vs/platform/theme/common/colorRegistry.ts` and domain-specific registry files in the VSCode tree. This is the catalog of every `--vscode-*` CSS variable VSCode can inject into a webview.
- **Canonical Dark Modern values (reference only)**: `/Users/rbower/code/vscode/extensions/theme-defaults/themes/dark_modern.json`. Used only to sanity-check the local docs-site theme file.
- **Local docs-site theme file (reference only)**: `/Users/rbower/code/qualcomm-ui/packages/docs/react-vscode-docs/src/themes/dark-modern.css` — a dev-time shim so the docs site renders components in Dark Modern colors. Not shipped; real webviews receive `--vscode-*` variables from whichever theme the user has active.
- **react-vscode source**: `/Users/rbower/code/qualcomm-ui/packages/frameworks/react-vscode/src/` — especially every `vs-*.css` file, which drives the actual runtime token usage.
- **In-progress consolidation spec**: `docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md` — for the 10 components currently under architectural refactor, this document is the source of truth for "current state". This analysis references it rather than re-judging parity on moving targets.

## Scope

### In scope

VSCode base UI primitives that can plausibly render inside a webview extension content area:

`actionbar`, `breadcrumbs`, `button`, `codicons`, `contextview`, `countBadge`, `dialog`, `dropdown`, `findinput`, `highlightedlabel`, `hover`, `iconLabel`, `icons`, `inputbox`, `keybindingLabel`, `list`, `menu`, `progressbar`, `radio`, `scrollbar`, `selectBox`, `severityIcon`, `table`, `toggle`, `toolbar`, `tree`.

Theme tokens used by the above, plus cross-cutting tokens (`focusBorder`, `foreground`, `descriptionForeground`, `disabledForeground`, `errorForeground`, `widget.*`, `icon.foreground`, `font-*`).

### Out of scope (appendix only)

Workbench-shell geometry primitives: `sash`, `splitview`, `grid`, `centered`, `resizable`, `mouseCursor`, base `dnd` manager.

Theme token domains tied to workbench chrome or specialized editors: `editor.*`, `tab.*` (editor tabs), `terminal.*`, `notebook.*`, `debugTokenExpression.*`, `testing.*`, `scmGraph.*`, `mergeEditor.*`, `peekView.*`, `symbolIcon.*`, `chart.*`, `activityBar.*`, `statusBar.*`, `sideBar.*`, `panel.*`, `titleBar.*`, `welcomePage.*`, `quickInput.*`, `suggestWidget.*`.

`actionbar` is provisionally in scope pending confirmation during analysis — it may prove to be shell-only.

## Methodology

### Component analysis

For each in-scope primitive:

1. Read `index.ts` (if present) and the main `.ts` file in the primitive's directory.
2. Read the primitive's `.css` file(s) to extract visual states and variants from class selectors.
3. Record the constructor options and the public API surface sufficient to detect states that do not appear in CSS (`disabled`, `loading`, `readonly`, `invalid`, etc.).
4. Cross-reference `colorRegistry.ts` for theme tokens keyed to the primitive.
5. Record the react-vscode equivalent (directory + exported component) and whether it is listed in the consolidation plan as in-flux.

When source is ambiguous about a state or variant, the entry records `unclear` rather than guesses. Ambiguous cases roll up into the appendix `Open questions` list.

### Parity assessment

Parity is assessed against visible behavior, not API shape. Four buckets:

- **complete** — the react-vscode component can render every visual state and variant VSCode's version can, and uses the correct theme tokens.
- **partial** — the react-vscode component covers the primitive but misses one or more variants, states, or tokens.
- **missing** — no react-vscode equivalent exists.
- **in-flux** — the component is listed in `docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md`. The entry references that spec and does not attempt a parity call.

### Token analysis

The production use case is webview extensions, which inherit `--vscode-*` CSS variables from whichever theme the user has active. `dark-modern.css` is a dev-time docs-site reference, not a shipped artifact. The audit's priorities reflect this:

**Priority 1 — Runtime token correctness (the only audit that ships).**

For every `var(--vscode-*)` reference in every `vs-*.css` file under `packages/frameworks/react-vscode/src/`:

1. Confirm the underlying token is defined in `colorRegistry.ts`. A reference to a token VSCode does not define is a silent styling bug — the webview will use the fallback (if one is specified) or render unstyled.
2. If a fallback value is supplied in the `var(..., <fallback>)` call, note whether the fallback is sensible.
3. Check `colorRegistry.ts` for the token's `deprecated` flag. Deprecated tokens still work but should be migrated.
4. For each in-scope primitive, list theme tokens `colorRegistry.ts` associates with that primitive's VSCode counterpart (e.g. everything in the `button.*` domain for button) and flag any the primitive's CSS does not reference but plausibly should. This surfaces missing style rules (e.g. a react-vscode button that forgets `button.secondaryBackground` variants).

**Priority 2 — Component/token alignment at the per-primitive level.**

For each in-scope primitive section, the "Theme tokens used" list records tokens actually referenced by its CSS. Cross-reference against `colorRegistry.ts` for tokens keyed to the primitive but not referenced — these are suggestions for possible coverage, not hard gaps.

**Priority 3 — Docs-site theme file drift (dev experience only).**

A single short subsection summarizing the state of `dark-modern.css`:

- Token keys referenced by in-scope primitive CSS but missing from `dark-modern.css` → the docs site renders with fallback values for these.
- Values in `dark-modern.css` that disagree with `dark_modern.json` → visible drift, worth refreshing when convenient.
- Keys present in `dark-modern.css` that are not in `colorRegistry.ts` → removed/renamed upstream; candidates for cleanup.

This is explicitly a best-effort summary; remediation is a follow-up, not part of this analysis.

## Document structure

```
# VSCode Design System Coverage for react-vscode

## Purpose

## How to read this document

## Methodology

## Components

### actionbar

(one section per in-scope primitive, alphabetical)

## Design tokens

### CSS variables referenced by react-vscode CSS (runtime audit)

(single table, one row per `var(--vscode-*)` reference found in `packages/frameworks/react-vscode/src/**/*.css`)

### Domain coverage by primitive

### Domain: button
### Domain: input
### Domain: list
(etc., one subsection per in-scope token domain, flagging any `colorRegistry.ts` keys not referenced by the associated primitive's CSS)

### dark-modern.css drift (dev-experience only)

(short summary: missing keys, value drift, orphan keys)

## Appendix

### Excluded shell-only primitives
### Excluded token domains
### Open questions
```

## Per-primitive section template

```
## <primitive-name>

**Source**: `src/vs/base/browser/ui/<dir>/`
**Purpose**: <one sentence>

### Variants
- <variant>: <short description>

### States
- <state>: <short description>

### Theme tokens used
- `<colorRegistry key>`: <role>

### react-vscode status
- **Equivalent**: `packages/frameworks/react-vscode/src/<dir>/` or "none"
- **Parity**: complete | partial | missing | in-flux (see `docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md`)
- **Gaps**: <bulleted list, or "none">
- **Notes**: <naming differences, open questions, anything else relevant>
```

## Per-token-domain section template

```
### Domain: <domain>

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
```

- **Used by primitive CSS**: `yes (<.css file>)` | `no` (where `no` means `colorRegistry.ts` defines the token for this domain but no in-scope react-vscode `.css` references it — a coverage suggestion, not a hard gap).
- **Notes**: `deprecated`, registry description, other metadata.

## CSS-variable runtime audit table template

```
### CSS variables referenced by react-vscode CSS

| var reference | File | In colorRegistry? | Fallback | Deprecated? | Notes |
|---------------|------|-------------------|----------|-------------|-------|
```

- **var reference**: e.g. `--vscode-button-background`.
- **File**: path relative to `packages/frameworks/react-vscode/src/`.
- **In colorRegistry?**: `yes` | `no` (a `no` row is a bug — the webview will fall back or render unstyled).
- **Fallback**: the fallback value in `var(name, fallback)` if present, else `—`.
- **Deprecated?**: `yes` (with recommended replacement from registry) | `no`.

## Appendix template

```
## Appendix

### Excluded shell-only primitives

| Primitive | Reason for exclusion |
|-----------|----------------------|

### Excluded token domains

| Domain | Reason for exclusion |
|--------|----------------------|

### Open questions

- <question raised during analysis, with the file/line that prompted it>
```

## Execution notes

- The analysis does not modify any code. It reads VSCode source and react-vscode source; it writes only the coverage document.
- Typography and spacing are not audited as tokens. VSCode has no formal type scale; it inherits host chrome typography via `--vscode-font-*` variables, which are included in the cross-cutting token list.
- Codicons are treated as a primitive (they live at `base/browser/ui/codicons/`). The entry documents the set and how they are referenced; it does not enumerate every glyph.
- For components in `docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md`, parity cells link to the relevant section of that spec instead of restating it.

## Verification of the completed document

Before handing off:

1. Every in-scope primitive has a section; every section has all template fields filled (`unclear` allowed, empty is not).
2. Every `var(--vscode-*)` reference in `packages/frameworks/react-vscode/src/**/*.css` appears as a row in the runtime audit table, with a verdict on whether the token exists in `colorRegistry.ts`.
3. Every token referenced in a primitive's "Theme tokens used" list appears in the relevant domain table or is flagged as out-of-scope.
4. Appendix lists every primitive and every domain that the scope section claims to exclude.
5. `Open questions` is non-empty only where source was genuinely ambiguous; the questions are specific enough to act on.

## Out of scope for this spec

- Building the Figma file or requesting additions from design. The document is input to those conversations, not the conversation itself.
- Updating `dark-modern.css`. Drift is documented; remediation is a follow-up.
- Implementing missing react-vscode components. The document is the roadmap; implementation plans follow per-component.
- Ensuring that webviews *inject* the CSS variables correctly. That is a host-side concern (the VSCode extension runtime supplies the variables). This analysis only validates that the CSS *references* match tokens the runtime provides.
- Screenshots or visual reference imagery.
- Angular or any other framework.
