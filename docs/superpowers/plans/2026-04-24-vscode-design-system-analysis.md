# VSCode Design System Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce `packages/frameworks/react-vscode/docs/vscode-coverage.md` — a reference document catalogging the webview-relevant subset of VSCode's design system (UI primitives + theme tokens) with per-primitive variants/states and a react-vscode parity assessment.

**Architecture:** Read-only analysis. Source inputs are the upstream VSCode repo at `/Users/rbower/code/vscode/`, the react-vscode package, the in-flux refactor spec, and the local docs-site theme file. The only file this plan creates is the coverage doc. No code is modified.

**Tech Stack:** Markdown. Bash (`grep`, `find`, `ls`, `rg`) for extraction. Read tool for sources. No test framework — the "verification" step is a structural checklist against the spec.

**Spec:** `docs/superpowers/specs/2026-04-24-vscode-design-system-analysis-design.md`

**In-flux reference:** `docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md` — cited verbatim in `Notes` for primitives under refactor.

---

## File structure

One file is produced by this plan:

- **Create**: `packages/frameworks/react-vscode/docs/vscode-coverage.md`

No other files are written. The plan builds the doc incrementally, committing after each section, so any intermediate stop yields a valid (partial) doc.

## Primitive grouping

The 26 in-scope VSCode primitives are grouped into 7 tasks by semantic similarity. Each task produces one commit.

| Task | Group | Primitives |
|------|-------|-----------|
| 2 | Labels & badges | `countBadge`, `severityIcon`, `keybindingLabel`, `highlightedlabel`, `iconLabel` |
| 3 | Buttons & icon infra | `button`, `codicons`, `icons`, `toggle` |
| 4 | Form inputs | `inputbox`, `findinput`, `selectBox`, `dropdown`, `radio` |
| 5 | Overlays & dialogs | `menu`, `contextview`, `hover`, `dialog` |
| 6 | Lists & tables | `list`, `tree`, `table` |
| 7 | Navigation | `actionbar`, `toolbar`, `breadcrumbs` |
| 8 | Feedback | `progressbar`, `scrollbar` |

Total: 5+4+5+4+3+3+2 = 26.

## In-flux components (refactor spec references)

The following react-vscode components are mid-refactor per `docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md`. When one appears in a primitive's "react-vscode status" block, set **Parity: in-flux** and reference the refactor spec section rather than scoring parity.

- `menu` → refactor section 1
- `dropdown` → refactor section 4 (renamed to `select`)
- `tooltip` → refactor section 3 (no direct VSCode base/browser primitive equivalent; if `hover` maps to tooltip, flag it)
- `progress`, `progress-circle` → refactor sections 7 & 8
- `checkbox` → refactor section 9
- `input` → refactor section 10 (renamed to `text-input`)
- `tabs` → refactor section 11

For primitives not in the refactor list, score parity directly.

## Commit format

Every commit uses this format (per auto-memory feedback):

- Title only — no body paragraphs
- Scope at module level — `docs(vscode-coverage)` for all tasks in this plan
- DCO signoff required (`git commit -s`)
- No Claude co-author

Example: `git commit -s -m "docs(vscode-coverage): add labels and badges section"`.

---

## Task 1: Scaffold the coverage doc

**Files:**
- Create: `packages/frameworks/react-vscode/docs/vscode-coverage.md`

- [ ] **Step 1: Create the directory**

Run: `mkdir -p /Users/rbower/code/qualcomm-ui/packages/frameworks/react-vscode/docs`

Expected: directory exists, no error.

- [ ] **Step 2: Write the scaffold with static sections**

Write this exact content to `packages/frameworks/react-vscode/docs/vscode-coverage.md`:

````markdown
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

<!-- Populated by tasks 2-8. One section per primitive, alphabetical within each task's group; the final document is reordered alphabetically in task 12 if needed. -->

## Design tokens

### CSS variables referenced by react-vscode CSS (runtime audit)

<!-- Populated by task 9 -->

### Domain coverage by primitive

<!-- Populated by task 10 -->

### dark-modern.css drift (dev-experience only)

<!-- Populated by task 11 -->

## Appendix

### Excluded shell-only primitives

<!-- Populated by task 12 -->

### Excluded token domains

<!-- Populated by task 12 -->

### Open questions

<!-- Populated incrementally throughout; finalized in task 12 -->
````

- [ ] **Step 3: Verify the scaffold**

Run: `wc -l /Users/rbower/code/qualcomm-ui/packages/frameworks/react-vscode/docs/vscode-coverage.md`

Expected: a line count greater than 40 and less than 80.

- [ ] **Step 4: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): scaffold coverage doc with methodology"
```

---

## Task 2: Labels & badges

**Primitives covered**: `countBadge`, `severityIcon`, `keybindingLabel`, `highlightedlabel`, `iconLabel`.

**Files:**
- Read (VSCode): `src/vs/base/browser/ui/<primitive>/` for each
- Read (react-vscode mapping candidates): `packages/frameworks/react-vscode/src/badge/`, `status/`, `keybinding/`, `icon/`
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md` (append sections under `## Components`)

### Per-primitive procedure

Run the following sequence for each of the 5 primitives in this task:

- [ ] **Step A: List the primitive's files**

Run: `ls /Users/rbower/code/vscode/src/vs/base/browser/ui/<primitive>/`

Record the file list. Identify the main `.ts` and any `.css`.

- [ ] **Step B: Read the main TypeScript file**

Read: `/Users/rbower/code/vscode/src/vs/base/browser/ui/<primitive>/<main>.ts`

Extract:
- Public class name(s)
- Constructor options interface (every field)
- Public methods that mutate visible state (`setEnabled`, `setLoading`, `setDisabled`, etc.)
- Any `enum` / union of variants

- [ ] **Step C: Read the CSS file(s)**

Run: `ls /Users/rbower/code/vscode/src/vs/base/browser/ui/<primitive>/*.css 2>/dev/null`

Read each result. Extract:
- Class selector list (e.g. `.monaco-count-badge`, `.monaco-count-badge.long`)
- Pseudo-classes and states (`:hover`, `:focus`, `.disabled`, `[aria-disabled="true"]`)
- Every `var(--vscode-*)` reference (record the token name and the CSS property it drives)

- [ ] **Step D: Cross-reference colorRegistry**

Run: `grep -nE '<primitivePrefix>' /Users/rbower/code/vscode/src/vs/platform/theme/common/colorRegistry.ts`

Where `<primitivePrefix>` is the token prefix for this primitive (see lookup table below). Capture every matching `registerColor('<key>', ...)` call along with its description string.

Prefix lookup for this task's primitives:
- `countBadge` → `activityBarBadge|extensionBadge|badge|profileBadge` (check all badge-related domains)
- `severityIcon` → `problemsErrorIcon|problemsWarningIcon|problemsInfoIcon|notificationsErrorIcon|notificationsWarningIcon|notificationsInfoIcon|editorError|editorWarning|editorInfo` (severity icons reuse per-context domains)
- `keybindingLabel` → `keybindingLabel`
- `highlightedlabel` → `list.filterMatchBackground|list.highlightForeground|editorSuggestWidget.highlightForeground` (highlighted labels reuse list/suggest token domains; also check for a dedicated registry)
- `iconLabel` → `icon.foreground` (plus any `iconLabel.*` keys if present — grep will reveal)

If a primitive has no direct domain, note it in `Open questions` and list the tokens it actually references (from step C) in "Theme tokens used".

- [ ] **Step E: Check react-vscode equivalent**

Run: `ls /Users/rbower/code/qualcomm-ui/packages/frameworks/react-vscode/src/ | grep -iE '<candidate>'`

Candidate directory per primitive:
- `countBadge` → `badge`
- `severityIcon` → `status` (react-vscode `status` is the severity-icon equivalent — a `Status` component with `severity` prop)
- `keybindingLabel` → `keybinding`
- `highlightedlabel` → none (expected)
- `iconLabel` → none (expected — `icon` handles the icon half but no "icon + label" composition exists)

If a directory is found, read its `index.ts` to list exports and the Simple API's props. If not found, state `none` and note it in the section.

- [ ] **Step F: Check refactor spec for in-flux status**

Each per-primitive task (2–8) includes a "react-vscode candidates & parity notes" block at the top. Consult it: if this primitive is marked in-flux, set parity to `in-flux` and cite the refactor spec section in Notes. Otherwise confirm by searching the refactor spec:

```
grep -nE '^### [0-9]+\. <react-vscode-component>' /Users/rbower/code/qualcomm-ui/docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md
```

A non-empty result means the component is in-flux. If parity is in-flux, skip Step G's rubric — the verdict is already decided.

- [ ] **Step G: Write the section using this template**

Append to `packages/frameworks/react-vscode/docs/vscode-coverage.md` under the `## Components` heading:

````markdown
### <primitive-name>

**Source**: `src/vs/base/browser/ui/<primitive>/`
**Purpose**: <one sentence derived from code comments + what the class does>

#### Variants
- <variant>: <short description> (from CSS class or API option)
- (if none) No distinct variants.

#### States
- <state>: <short description>
- (minimum: disabled if the API supports it, hover/focus if CSS shows them)

#### Theme tokens used
- `<colorRegistry key>`: <role — from the registry description + the CSS property it drives>

#### react-vscode status
- **Equivalent**: `packages/frameworks/react-vscode/src/<dir>/` or `none`
- **Parity**: `complete` | `partial` | `missing` | `in-flux`
- **Gaps**: <bulleted list of specific variants/states/tokens missing, or `none`>
- **Notes**: <naming differences, open questions, cross-refs>
````

Parity scoring rubric:
- `complete` — every variant and state from steps B/C is renderable, and every token from step D is either referenced in the react-vscode CSS or explicitly n/a for the react-vscode design.
- `partial` — at least one variant, state, or token is missing from the react-vscode implementation.
- `missing` — step E returned `none` or the react-vscode component covers a different concept entirely.

### Task 2 completion steps

- [ ] **Step 1: Run steps A–G for `countBadge`**

- [ ] **Step 2: Run steps A–G for `severityIcon`**

- [ ] **Step 3: Run steps A–G for `keybindingLabel`**

- [ ] **Step 4: Run steps A–G for `highlightedlabel`**

- [ ] **Step 5: Run steps A–G for `iconLabel`**

- [ ] **Step 6: Verify task output**

Run: `grep -c '^### ' /Users/rbower/code/qualcomm-ui/packages/frameworks/react-vscode/docs/vscode-coverage.md`

Expected: 11 (6 scaffold headings from Task 1 under `## Design tokens` and `## Appendix`, plus the 5 new component headings).

Also verify every section has non-empty `#### Variants`, `#### States`, `#### Theme tokens used`, and `#### react-vscode status` blocks — no trailing `<fill in>` markers.

- [ ] **Step 7: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add labels and badges sections"
```

---

## Task 3: Buttons & icon infra

**Primitives covered**: `button`, `codicons`, `icons`, `toggle`.

**Files:**
- Read (VSCode): `src/vs/base/browser/ui/<primitive>/` for each
- Read (react-vscode mapping candidates): `packages/frameworks/react-vscode/src/button/`, `icon/`, `icon-button/`, `checkbox/`
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md`

**Per-primitive procedure**: use steps A–G from Task 2.

**Prefix lookup**:
- `button` → `button|extensionButton`
- `codicons` → `icon.foreground` (plus any glyph-specific keys for the codicon CSS classes)
- `icons` → `icon.foreground` (generic). Note: `icons/` is where VSCode defines the `Codicon` type union and icon-class helpers. This entry should describe the *icon registration system*, not the glyph catalog.
- `toggle` → `inputOption|checkbox`

**react-vscode candidates**:
- `button` → `button`
- `codicons` → `icon` (the VSCode `codicons` directory is not a visual component — it's the registry; react-vscode's `icon` consumes codicon names. If the analysis shows `codicons` is purely an icon-registry file with no visual primitive, treat `Equivalent: none (registry only)` and parity `n/a — registry`.)
- `icons` → `icon` (same caveat — this is the icon-class helper, `Equivalent: none (helpers only)` is acceptable)
- `toggle` → `checkbox` (VSCode's toggle is the "checkbox-like two-state switch" VSCode uses in the search panel and editor toolbar. react-vscode's `checkbox` is the closest fit. **`checkbox` is in-flux per refactor spec section 9** — set parity to `in-flux`.)

### Task 3 completion steps

- [ ] **Step 1: Run A–G for `button`**
- [ ] **Step 2: Run A–G for `codicons`**
- [ ] **Step 3: Run A–G for `icons`**
- [ ] **Step 4: Run A–G for `toggle`**
- [ ] **Step 5: Verify**

Run: `grep -c '^### ' packages/frameworks/react-vscode/docs/vscode-coverage.md`
Expected: 15 (6 scaffold + 5 from task 2 + 4 new).

- [ ] **Step 6: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add buttons and icon infra sections"
```

---

## Task 4: Form inputs

**Primitives covered**: `inputbox`, `findinput`, `selectBox`, `dropdown`, `radio`.

**Files:**
- Read (VSCode): `src/vs/base/browser/ui/<primitive>/`
- Read (react-vscode): `packages/frameworks/react-vscode/src/input/`, `dropdown/`, `dropdown-input/`, `option/` (radio currently has no react-vscode equivalent)
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md`

**Per-primitive procedure**: use steps A–G from Task 2.

**Prefix lookup**:
- `inputbox` → `input|inputValidation|inputOption|searchEditor.textInput`
- `findinput` → `inputOption|input|inputValidation` (find inputs compose `inputbox` + an options row)
- `selectBox` → `dropdown|settings.dropdown`
- `dropdown` → `dropdown|settings.dropdown` (VSCode `dropdown` ≠ react-vscode `dropdown`; VSCode's is a dropdown *button*, react-vscode's was positioned as a select/value-picker)
- `radio` → `radio`

**react-vscode candidates & parity notes**:
- `inputbox` → `input`. **In-flux per refactor spec section 10** (renamed `text-input`). Set parity `in-flux`.
- `findinput` → none (no direct equivalent). Set `missing`.
- `selectBox` → `dropdown`. **In-flux per refactor spec section 4** (renamed `select`, state machine changing). Set `in-flux`.
- `dropdown` (the VSCode primitive — a dropdown button) → `dropdown-input` is the closest visual match; the refactor spec keeps `dropdown-input` as-is. Parity likely `partial` or `complete` depending on variants.
- `radio` → none. Set `missing`.

### Task 4 completion steps

- [ ] **Step 1: Run A–G for `inputbox`**
- [ ] **Step 2: Run A–G for `findinput`**
- [ ] **Step 3: Run A–G for `selectBox`**
- [ ] **Step 4: Run A–G for `dropdown`** (VSCode primitive)
- [ ] **Step 5: Run A–G for `radio`**
- [ ] **Step 6: Verify**

Run: `grep -c '^### ' packages/frameworks/react-vscode/docs/vscode-coverage.md`
Expected: 20 (6 scaffold + 14 components).

- [ ] **Step 7: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add form inputs sections"
```

---

## Task 5: Overlays & dialogs

**Primitives covered**: `menu`, `contextview`, `hover`, `dialog`.

**Files:**
- Read (VSCode): `src/vs/base/browser/ui/<primitive>/`
- Read (react-vscode): `packages/frameworks/react-vscode/src/menu/`, `dialog/`, `tooltip/`, `overlay-panel/`
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md`

**Per-primitive procedure**: use steps A–G from Task 2.

**Prefix lookup**:
- `menu` → `menu`
- `contextview` → no dedicated prefix; `contextview` is a primitive for absolute-positioned anchored content. Extract whatever tokens its CSS references and note the lack of a registry domain.
- `hover` → `editorHoverWidget|hoverWidget`
- `dialog` → `editorWidget|dialog`

**react-vscode candidates & parity notes**:
- `menu` → `menu`. **In-flux per refactor spec section 1** (rebuild on `react-core/menu`). Set `in-flux`.
- `contextview` → no react-vscode component is a 1:1 (the refactor creates a generic `popover` in section 5; that's the intended future equivalent). Set parity `missing` with a `Notes` line pointing to refactor section 5.
- `hover` → `tooltip`. **In-flux per refactor spec section 3**. Set `in-flux`.
- `dialog` → `dialog`. Refactor spec marks it "OK as-is"; score parity directly.

### Task 5 completion steps

- [ ] **Step 1: Run A–G for `menu`**
- [ ] **Step 2: Run A–G for `contextview`**
- [ ] **Step 3: Run A–G for `hover`**
- [ ] **Step 4: Run A–G for `dialog`**
- [ ] **Step 5: Verify**

Run: `grep -c '^### ' packages/frameworks/react-vscode/docs/vscode-coverage.md`
Expected: 24 (6 scaffold + 18 components).

- [ ] **Step 6: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add overlays and dialogs sections"
```

---

## Task 6: Lists & tables

**Primitives covered**: `list`, `tree`, `table`.

**Files:**
- Read (VSCode): `src/vs/base/browser/ui/<primitive>/` (note: `list` and `tree` are large — multiple files each)
- Read (react-vscode): `packages/frameworks/react-vscode/src/table/` (no list or tree exist yet)
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md`

**Per-primitive procedure**: use steps A–G from Task 2. For `list` and `tree`, step B should focus on the main constructor options interface (`IListOptions`, `ITreeOptions`) rather than enumerating every renderer/delegate helper.

**Prefix lookup**:
- `list` → `list|listFilterWidget`
- `tree` → `tree|list` (tree inherits most list tokens)
- `table` → `keybindingTable|tree.tableColumnsBorder|tree.tableOddRowsBackground` (table visual tokens are split across the `tree.table*` and `keybindingTable` domains)

**react-vscode candidates**:
- `list` → none. Set `missing`.
- `tree` → none. Set `missing`. (Refactor spec lists `tree` in "Out of scope" for the current consolidation.)
- `table` → `table`. Refactor spec marks it "OK as-is"; score parity directly.

### Task 6 completion steps

- [ ] **Step 1: Run A–G for `list`**
- [ ] **Step 2: Run A–G for `tree`**
- [ ] **Step 3: Run A–G for `table`**
- [ ] **Step 4: Verify**

Run: `grep -c '^### ' packages/frameworks/react-vscode/docs/vscode-coverage.md`
Expected: 27 (6 scaffold + 21 components).

- [ ] **Step 5: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add lists and tables sections"
```

---

## Task 7: Navigation

**Primitives covered**: `actionbar`, `toolbar`, `breadcrumbs`.

**Files:**
- Read (VSCode): `src/vs/base/browser/ui/<primitive>/`
- Read (react-vscode): none — no direct navigation primitives exist. `tabs/` is the closest conceptually but serves a different purpose.
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md`

**Per-primitive procedure**: use steps A–G from Task 2.

**Prefix lookup**:
- `actionbar` → `actionBar` (if present in registry; otherwise reuses `toolbar.*`)
- `toolbar` → `toolbar`
- `breadcrumbs` → `breadcrumb|breadcrumbPicker`

**react-vscode candidates**: all `none`. Set `missing` for all three.

**Actionbar scope decision**: the spec provisionally placed `actionbar` in scope. After step C (reading its CSS), decide:
- If the CSS is purely about horizontal action-row layout with no workbench-chrome-specific selectors, keep in scope.
- If it only appears inside workbench-chrome contexts (activityBar, panel headers, etc.) and never as a standalone widget suitable for a webview, move it to the appendix.
- Record the decision in `Open questions`. Do not modify the scope retroactively in other tasks — the entry stays in the Components section regardless; the Notes call out whether it's webview-applicable.

### Task 7 completion steps

- [ ] **Step 1: Run A–G for `actionbar`**
- [ ] **Step 2: Run A–G for `toolbar`**
- [ ] **Step 3: Run A–G for `breadcrumbs`**
- [ ] **Step 4: Verify**

Run: `grep -c '^### ' packages/frameworks/react-vscode/docs/vscode-coverage.md`
Expected: 30 (6 scaffold + 24 components).

- [ ] **Step 5: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add navigation sections"
```

---

## Task 8: Feedback

**Primitives covered**: `progressbar`, `scrollbar`.

**Files:**
- Read (VSCode): `src/vs/base/browser/ui/<primitive>/`
- Read (react-vscode): `packages/frameworks/react-vscode/src/progress/`, `progress-circle/`. Scrollbar has no react-vscode equivalent (it's usually left to the browser/CSS).
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md`

**Per-primitive procedure**: use steps A–G from Task 2.

**Prefix lookup**:
- `progressbar` → `progressBar`
- `scrollbar` → `scrollbar|scrollbarSlider`

**react-vscode candidates**:
- `progressbar` → `progress`. **In-flux per refactor spec section 7**. Set `in-flux`. (Note: `progress-circle` is a distinct react-vscode component with no VSCode-base-primitive equivalent; it is *not* a primitive we audit here.)
- `scrollbar` → none. Set `missing` with a `Notes` line: "Webviews typically rely on native browser scrollbars; VSCode's custom scrollbar is bundled into workbench-shell-specific scroll containers. Consider whether a react-vscode component is needed for webview contexts."

### Task 8 completion steps

- [ ] **Step 1: Run A–G for `progressbar`**
- [ ] **Step 2: Run A–G for `scrollbar`**
- [ ] **Step 3: Verify**

Run: `grep -c '^### ' packages/frameworks/react-vscode/docs/vscode-coverage.md`
Expected: 32 (6 scaffold + 26 components — every in-scope primitive documented).

- [ ] **Step 4: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add feedback sections"
```

---

## Task 9: Token runtime audit (Priority 1)

**Files:**
- Read: every `packages/frameworks/react-vscode/src/**/*.css`
- Read: `/Users/rbower/code/vscode/src/vs/platform/theme/common/colorRegistry.ts`
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md` (fill the `### CSS variables referenced by react-vscode CSS (runtime audit)` subsection under `## Design tokens`)

- [ ] **Step 1: Enumerate every CSS file in react-vscode**

Run: `find /Users/rbower/code/qualcomm-ui/packages/frameworks/react-vscode/src -name "*.css" -type f | sort`

Record the file list.

- [ ] **Step 2: Extract every `--vscode-*` reference**

Run: `grep -rnoE 'var\(--vscode-[a-zA-Z0-9._-]+(, [^)]+)?\)' /Users/rbower/code/qualcomm-ui/packages/frameworks/react-vscode/src --include='*.css' | sort -u`

Each line is `<file>:<line>:<match>`. Build a table:

| Token | File | Line | Fallback |
|-------|------|------|----------|

Parse each match: the token is `--vscode-<name>`, the fallback is whatever follows `, ` before the closing `)` (empty if absent).

- [ ] **Step 3: Verify every token against colorRegistry.ts**

For each unique token in the table, run:

```
grep -nE "registerColor\(\s*['\"]<token-without-vscode-prefix-using-dots>['\"]" /Users/rbower/code/vscode/src/vs/platform/theme/common/colorRegistry.ts
```

Example: `--vscode-button-background` → search for `registerColor\(\s*['\"]button\.background['\"]`.

Also search every other registry file (they exist across the VSCode tree — not all colors are in `colorRegistry.ts`):

```
grep -rnE "registerColor\(\s*['\"]<token>['\"]" /Users/rbower/code/vscode/src/
```

Record verdict per token:
- `yes` — found in any registry file
- `no` — not found anywhere

- [ ] **Step 4: Check for deprecated tokens**

For each `yes` token, look for a `deprecated` or `deprecationMessage` property in the `registerColor(...)` call (colorRegistry's signature includes this). Record `yes` / `no` per token.

- [ ] **Step 5: Write the runtime audit table**

Replace the `<!-- Populated by task 9 -->` placeholder under `### CSS variables referenced by react-vscode CSS (runtime audit)` with:

````markdown
This table lists every `var(--vscode-*)` reference in `packages/frameworks/react-vscode/src/**/*.css` and whether the underlying token is defined by VSCode at runtime.

| Token | File(s) | In colorRegistry? | Fallback | Deprecated? | Notes |
|-------|---------|-------------------|----------|-------------|-------|
| `--vscode-button-background` | `button/vs-button.css` | yes | — | no | — |
(... one row per unique token; if one token is referenced in multiple files, list all in the File(s) column separated by `;`)

**Runtime-critical findings:**
- Tokens with `In colorRegistry? = no`: <list them; each is a silent styling bug>
- Deprecated tokens in use: <list them with recommended replacement>
- Tokens without fallbacks that are not in colorRegistry: <most dangerous — webview will render completely unstyled>
````

If there are no findings in a finding category, write `none`.

- [ ] **Step 6: Verify**

Confirm the table has one row per unique token from step 2. Confirm the three finding lists are present (possibly empty).

- [ ] **Step 7: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add runtime token audit"
```

---

## Task 10: Token domain coverage (Priority 2)

**Files:**
- Read: `/Users/rbower/code/vscode/src/vs/platform/theme/common/colorRegistry.ts`
- Read: previously-written primitive sections in `vscode-coverage.md` (for the "Used by primitive CSS" column)
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md` (fill the `### Domain coverage by primitive` subsection)

**Domains in scope** (derived from spec's in-scope token list):

`button`, `input`, `inputValidation`, `inputOption`, `dropdown`, `list`, `menu`, `menubar`, `keybindingLabel`, `keybindingTable`, `toolbar`, `breadcrumb`, `breadcrumbPicker`, `progressBar`, `scrollbar`, `scrollbarSlider`, `badge`, `notificationLink`, `widget`, `focusBorder`, `foreground`, `descriptionForeground`, `disabledForeground`, `errorForeground`, `icon.foreground`.

(Plus: `actionBar`, `activityBarBadge`, `extensionBadge`, `profileBadge` for badge-related coverage.)

- [ ] **Step 1: Enumerate every token per domain**

For each domain in the list above, run:

```
grep -nE "registerColor\(\s*['\"]<domain>\." /Users/rbower/code/vscode/src/vs/platform/theme/common/colorRegistry.ts
```

Also search other registry files:

```
grep -rnE "registerColor\(\s*['\"]<domain>\." /Users/rbower/code/vscode/src/
```

Record every token key and its description string.

For cross-cutting single-token domains (`focusBorder`, `foreground`, `descriptionForeground`, `disabledForeground`, `errorForeground`, `icon.foreground`), each is a single row.

- [ ] **Step 2: For each token, determine whether react-vscode CSS references it**

Use the table from task 9. A token is "used by primitive CSS" if the task-9 table contains it.

- [ ] **Step 3: Write one subsection per domain**

Replace the `<!-- Populated by task 10 -->` placeholder with domain tables:

````markdown
#### Domain: button

| Token key | Purpose | Used by primitive CSS | Notes |
|-----------|---------|-----------------------|-------|
| `button.background` | Button background color | yes (`button/vs-button.css`) | — |
| `button.foreground` | Button text color | yes | — |
| `button.hoverBackground` | Button hover background | yes | — |
| `button.border` | Button border | no | coverage suggestion — see button primitive section for discussion |
| ... (one row per registry key) |

(... one subsection per domain)
````

`Used by primitive CSS`: `yes (<css file>)`, `yes` if multiple, or `no`.
`Notes`: `deprecated`, the registry description if non-trivial, or `—`.

- [ ] **Step 4: Verify**

Confirm every domain has a subsection. Confirm every row has all four columns filled.

- [ ] **Step 5: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add token domain coverage"
```

---

## Task 11: dark-modern.css drift (Priority 3)

**Files:**
- Read: `/Users/rbower/code/qualcomm-ui/packages/docs/react-vscode-docs/src/themes/dark-modern.css`
- Read: `/Users/rbower/code/vscode/extensions/theme-defaults/themes/dark_modern.json`
- Read: `/Users/rbower/code/vscode/src/vs/platform/theme/common/colorRegistry.ts`
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md` (fill the `### dark-modern.css drift (dev-experience only)` subsection)

- [ ] **Step 1: Extract every token key defined in dark-modern.css**

Run: `grep -oE '\-\-vscode-[a-zA-Z0-9._\\-]+' /Users/rbower/code/qualcomm-ui/packages/docs/react-vscode-docs/src/themes/dark-modern.css | sort -u`

Record the list.

- [ ] **Step 2: Extract every token key from dark_modern.json**

Run: `grep -oE '"[a-zA-Z]+\.[a-zA-Z.]+"' /Users/rbower/code/vscode/extensions/theme-defaults/themes/dark_modern.json | sort -u`

(The JSON uses `"button.background"` style keys; dark-modern.css uses `--vscode-button-background`. Map one to the other by replacing `.` with `-` and prepending `--vscode-`.)

- [ ] **Step 3: Compare**

Build three lists:

- **Missing from dark-modern.css**: tokens used by primitive CSS (from task 9) that are not in step 1's list. These render with fallback in the docs site.
- **Value drift**: tokens present in both dark-modern.css and dark_modern.json but with different values. To detect: for each key in both lists, compare the value. Values in dark_modern.json are hex or rgba; dark-modern.css uses the same. Mismatches go on this list.
- **Orphan keys in dark-modern.css**: keys in dark-modern.css that do not appear in `colorRegistry.ts` (removed or renamed upstream). Use the task-9 methodology (search for `registerColor('<key>'`) per key.

- [ ] **Step 4: Write the drift summary**

Replace the `<!-- Populated by task 11 -->` placeholder with:

````markdown
`dark-modern.css` is a dev-time docs-site reference (see Methodology). Drift below does not affect shipped behavior in webviews — it only changes how components render in the react-vscode-docs site.

**Missing from dark-modern.css** (docs site uses CSS fallback or default rendering):

- `--vscode-<token>`: <value from dark_modern.json>
- (... or `none`)

**Value drift** (dark-modern.css disagrees with dark_modern.json):

| Token | dark-modern.css | dark_modern.json |
|-------|-----------------|------------------|
(... or `none`)

**Orphan keys** (present in dark-modern.css, not in colorRegistry.ts — candidates for cleanup):

- `--vscode-<token>`
- (... or `none`)

**Summary**: <N> tokens missing, <N> values drifted, <N> orphans. Remediation is a follow-up; this analysis documents the current state only.
````

- [ ] **Step 5: Verify**

Confirm all three lists are present (possibly `none`) and the summary line has concrete counts.

- [ ] **Step 6: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): add dark-modern.css drift summary"
```

---

## Task 12: Appendix and final verification

**Files:**
- Modify: `packages/frameworks/react-vscode/docs/vscode-coverage.md` (fill the three appendix subsections)

- [ ] **Step 1: Write the excluded shell-only primitives table**

Replace the first `<!-- Populated by task 12 -->` placeholder:

````markdown
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
````

If Task 7's actionbar decision moved `actionbar` here, add a row for it with rationale.

- [ ] **Step 2: Write the excluded token domains table**

Replace the second `<!-- Populated by task 12 -->` placeholder:

````markdown
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
````

- [ ] **Step 3: Finalize Open questions**

Replace the third `<!-- Populated by task 12 -->` placeholder with the collected open questions from Tasks 2–11. Every `unclear` entry in a primitive section should correspond to an `Open questions` bullet here.

Template:

````markdown
- <question>: <source file/line that prompted it> — raised in section `<primitive>`.
````

If no open questions were raised, write `None`.

- [ ] **Step 4: Run verification checklist from the spec**

Open `docs/superpowers/specs/2026-04-24-vscode-design-system-analysis-design.md` and run through "Verification of the completed document":

1. **Every in-scope primitive has a section**. Run: `grep -c '^### ' packages/frameworks/react-vscode/docs/vscode-coverage.md`. Expected: 32 (26 component entries + 6 scaffold headings under Design tokens and Appendix). To count components only: `awk '/^## Design tokens/{exit} /^### / && p' packages/frameworks/react-vscode/docs/vscode-coverage.md; BEGIN{p=0}' | wc -l` — or visually confirm there are 26 headings between `## Components` and `## Design tokens`.
2. **Every primitive section has all four subheadings filled**. Run: for each `### <primitive>` block, confirm `#### Variants`, `#### States`, `#### Theme tokens used`, `#### react-vscode status` all appear and are non-empty (no `TBD`, no `<fill in>`).
3. **Every `var(--vscode-*)` reference in react-vscode CSS appears in the runtime audit table**. Cross-check the table against `grep -rE 'var\(--vscode-' packages/frameworks/react-vscode/src --include='*.css' | sort -u | wc -l`.
4. **Every token listed under "Theme tokens used" for each primitive appears in a domain table or is flagged out-of-scope**. Spot-check 3 primitives.
5. **Appendix lists every primitive and every domain that scope claims to exclude**. Compare Appendix rows to the spec's "Out of scope" list.
6. **Open questions are specific enough to act on**. Each bullet must name a file or section.

Record any failures; fix before commit.

- [ ] **Step 5: Reorder Components section alphabetically**

If tasks 2–8 appended primitives in task-group order rather than pure alphabetical order, reorder the `### <primitive>` blocks under `## Components` alphabetically (case-insensitive) so readers can find them predictably. Verify with:

Run: `grep -E '^### ' packages/frameworks/react-vscode/docs/vscode-coverage.md | head -40`

Expected: primitives listed in alphabetical order.

- [ ] **Step 6: Commit**

```bash
git add packages/frameworks/react-vscode/docs/vscode-coverage.md
git commit -s -m "docs(vscode-coverage): finalize appendix and verification"
```

---

## Plan summary

- 12 tasks, each ending in a commit.
- Single output: `packages/frameworks/react-vscode/docs/vscode-coverage.md`.
- No code modified; read-only analysis over VSCode source, react-vscode source, and theme files.
- In-flux components defer to `docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md` rather than scoring parity on moving targets.
- Commit scope is `docs(vscode-coverage)` uniformly; DCO signoff required; no Claude co-author.
