# react-vscode Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `@qualcomm-ui/react-vscode` components to architectural parity with their QDS `@qualcomm-ui/react` peers: full compound API plus Simple API where QDS provides one, correct state machines (menu→`react-core/menu`, dropdown→`react-core/select`, overlay-panel→new `popover`), and `dropdown-input` folded into `Select.Control`.

**Architecture:** Each VSCode component is a thin styling wrapper over `react-core` primitives. The canonical source is the QDS peer in `packages/frameworks/react/src/<component>/`; each VSCode part mirrors that peer minus the `qds-core` styling plumbing, with `vs-*` CSS classes in place of `qds-core` binding calls.

**Tech Stack:** React 19, TypeScript strict, `@qualcomm-ui/react-core`, `@qualcomm-ui/core`, Tailwind v4 via `@qualcomm-ui/tailwind-plugin`. No tests added (out of scope).

**Spec:** `docs/superpowers/specs/2026-04-24-react-vscode-refactor-design.md`

**Commit format:** Module-scoped titles, DCO signoff, no Claude co-author line (per repo feedback). Example: `refactor(checkbox): add hint and error-text parts`.

---

## Preflight

- [ ] **Step 0.1: Confirm clean working tree**

```bash
git status
```
Expected: "nothing to commit, working tree clean" on branch `feature/migrate-react-vscode-library`.

- [ ] **Step 0.2: Confirm react-vscode builds clean from current HEAD**

```bash
pnpm --filter @qualcomm-ui/react-vscode build
```
Expected: success. If it fails, fix before starting.

- [ ] **Step 0.3: Confirm docs site starts**

```bash
pnpm --filter @qualcomm-ui/react-vscode-docs dev
```
Expected: Vite dev server at http://localhost:5173 (or similar). Open the home page + a few component pages. Ctrl-C to stop.

---

## Adaptation Recipe (referenced by tasks)

When porting a QDS peer file to react-vscode, apply these mechanical edits:

1. Drop the `// Copyright ...` license header (not used in react-vscode).
2. Drop imports from `@qualcomm-ui/qds-core/*` (e.g., `createQdsXxxApi`, `QdsXxxApiProps`, `qdsXxxClasses`).
3. Drop imports from `./qds-<component>-context` (QDS-local context file).
4. Drop `QdsXxxContextProvider` wrappers from the JSX tree.
5. Drop `useQdsXxxContext()` calls and the `qdsContext.getXxxBindings()` entries in `mergeProps(...)` chains.
6. Insert `{className: "vs-<component>[__<part>]"}` in the `mergeProps(...)` chain where the QDS binding was.
7. If the QDS file imports from `@qualcomm-ui/react/input` for `InputHint`/`InputErrorText`, replace the render element with a plain `<div>` carrying the VS Code class.
8. Filenames and exported symbols mirror QDS exactly. Do not rename.

Apply each file through this recipe unless a task gives a more specific instruction.

---

## Task 1: checkbox — add hint and error-text

**Files:**
- Create: `packages/frameworks/react-vscode/src/checkbox/checkbox-hint.tsx`
- Create: `packages/frameworks/react-vscode/src/checkbox/checkbox-error-text.tsx`
- Modify: `packages/frameworks/react-vscode/src/checkbox/checkbox.tsx` (Simple API)
- Modify: `packages/frameworks/react-vscode/src/checkbox/index.ts`
- Modify: `packages/frameworks/react-vscode/src/checkbox/vs-checkbox.css`

**QDS ref:** `packages/frameworks/react/src/checkbox/checkbox-hint.tsx`, `checkbox-error-text.tsx`, `checkbox.tsx`.

- [ ] **Step 1.1: Create `checkbox-hint.tsx`**

```tsx
import type {ReactElement, ReactNode} from "react"

import {useCheckboxHint} from "@qualcomm-ui/react-core/checkbox"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CheckboxHintProps extends IdProp {
  children?: ReactNode
  className?: string
}

/**
 * A help message displayed below the checkbox. Renders a `<div>` element.
 */
export function CheckboxHint({
  children,
  id,
  ...props
}: CheckboxHintProps): ReactElement {
  const contextProps = useCheckboxHint({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-checkbox__hint"},
    props,
  )
  return <div {...mergedProps}>{children}</div>
}
```

- [ ] **Step 1.2: Create `checkbox-error-text.tsx`**

```tsx
import type {ReactElement, ReactNode} from "react"

import {useCheckboxErrorText} from "@qualcomm-ui/react-core/checkbox"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CheckboxErrorTextProps extends IdProp {
  children?: ReactNode
  className?: string
}

/**
 * Error message displayed when the checkbox is invalid. Renders a `<div>` element.
 */
export function CheckboxErrorText({
  children,
  id,
  ...props
}: CheckboxErrorTextProps): ReactElement {
  const contextProps = useCheckboxErrorText({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-checkbox__error-text"},
    props,
  )
  return <div {...mergedProps}>{children}</div>
}
```

- [ ] **Step 1.3: Extend Simple `Checkbox` in `checkbox.tsx`**

Replace the file contents with:

```tsx
import type {ReactElement, ReactNode} from "react"

import type {CheckboxElementIds} from "@qualcomm-ui/core/checkbox"
import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {CheckboxControl, type CheckboxControlProps} from "./checkbox-control"
import {
  CheckboxErrorText,
  type CheckboxErrorTextProps,
} from "./checkbox-error-text"
import {
  CheckboxHiddenInput,
  type CheckboxHiddenInputProps,
} from "./checkbox-hidden-input"
import {CheckboxHint, type CheckboxHintProps} from "./checkbox-hint"
import {
  CheckboxIndicator,
  type CheckboxIndicatorProps,
} from "./checkbox-indicator"
import {CheckboxLabel, type CheckboxLabelProps} from "./checkbox-label"
import {CheckboxRoot, type CheckboxRootProps} from "./checkbox-root"

export interface CheckboxProps extends CheckboxRootProps {
  "aria-label"?: string | undefined
  "aria-labelledby"?: string | undefined

  /**
   * The simple Checkbox doesn't support children.
   */
  children?: never

  controlProps?: CheckboxControlProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: ReactNode
  errorTextProps?: CheckboxErrorTextProps

  hiddenInputProps?: CheckboxHiddenInputProps

  /**
   * Optional hint text that describes the element.
   */
  hint?: ReactNode
  hintProps?: CheckboxHintProps

  indicatorProps?: CheckboxIndicatorProps

  label?: ReactNode
  labelProps?: CheckboxLabelProps
}

export function Checkbox({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  controlProps,
  errorText,
  errorTextProps,
  hiddenInputProps: hiddenInputPropsProp,
  hint,
  hintProps,
  indicatorProps,
  label,
  labelProps,
  ...props
}: CheckboxProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children
  const hintContent = hint || hintProps?.children

  const hiddenInputProps = {...hiddenInputPropsProp}
  if (ariaLabel !== undefined) {
    hiddenInputProps["aria-label"] = ariaLabel
  }
  if (ariaLabelledBy !== undefined) {
    hiddenInputProps["aria-labelledby"] = ariaLabelledBy
  }

  const ids: Partial<CheckboxElementIds> = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hiddenInput: useControlledId(hiddenInputProps?.id),
    hint: useOptionalContentId(hintContent, hintProps),
    label: useOptionalContentId(labelContent, labelProps),
    root: useControlledId(props.id),
    ...props.ids,
  }

  return (
    <CheckboxRoot {...props} id={ids.root} ids={ids}>
      <CheckboxHiddenInput {...hiddenInputProps} id={ids.hiddenInput} />
      <CheckboxControl {...controlProps}>
        <CheckboxIndicator {...indicatorProps} />
      </CheckboxControl>
      {labelContent ? (
        <CheckboxLabel {...labelProps} id={ids.label}>
          {labelContent}
        </CheckboxLabel>
      ) : null}
      {hintContent ? (
        <CheckboxHint {...hintProps} id={ids.hint}>
          {hintContent}
        </CheckboxHint>
      ) : null}
      {errorTextContent ? (
        <CheckboxErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </CheckboxErrorText>
      ) : null}
    </CheckboxRoot>
  )
}
```

- [ ] **Step 1.4: Update `index.ts` to export the new parts**

Add these imports/exports to the existing `checkbox/index.ts` so `Checkbox.Hint` and `Checkbox.ErrorText` are available on the namespace:

```ts
import {Checkbox as SimpleCheckbox} from "./checkbox"
import {CheckboxContext, type CheckboxContextProps} from "./checkbox-context"
import {CheckboxControl, type CheckboxControlProps} from "./checkbox-control"
import {
  CheckboxErrorText,
  type CheckboxErrorTextProps,
} from "./checkbox-error-text"
import {
  CheckboxHiddenInput,
  type CheckboxHiddenInputProps,
} from "./checkbox-hidden-input"
import {CheckboxHint, type CheckboxHintProps} from "./checkbox-hint"
import {
  CheckboxIndicator,
  type CheckboxIndicatorProps,
} from "./checkbox-indicator"
import {CheckboxLabel, type CheckboxLabelProps} from "./checkbox-label"
import {CheckboxRoot, type CheckboxRootProps} from "./checkbox-root"

export type {
  CheckboxContextProps,
  CheckboxControlProps,
  CheckboxErrorTextProps,
  CheckboxHiddenInputProps,
  CheckboxHintProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxRootProps,
}

type CheckboxComponent = typeof SimpleCheckbox & {
  Context: typeof CheckboxContext
  Control: typeof CheckboxControl
  ErrorText: typeof CheckboxErrorText
  HiddenInput: typeof CheckboxHiddenInput
  Hint: typeof CheckboxHint
  Indicator: typeof CheckboxIndicator
  Label: typeof CheckboxLabel
  Root: typeof CheckboxRoot
}

export const Checkbox: CheckboxComponent = SimpleCheckbox as CheckboxComponent

Checkbox.Context = CheckboxContext
Checkbox.Control = CheckboxControl
Checkbox.ErrorText = CheckboxErrorText
Checkbox.HiddenInput = CheckboxHiddenInput
Checkbox.Hint = CheckboxHint
Checkbox.Indicator = CheckboxIndicator
Checkbox.Label = CheckboxLabel
Checkbox.Root = CheckboxRoot
```

- [ ] **Step 1.5: Add CSS for new parts**

Append to `packages/frameworks/react-vscode/src/checkbox/vs-checkbox.css`:

```css
.vs-checkbox__hint {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-font-size);
  margin-top: 4px;
}

.vs-checkbox__error-text {
  color: var(--vscode-errorForeground);
  font-size: var(--vscode-font-size);
  margin-top: 4px;
}
```

- [ ] **Step 1.6: Verify**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
```
Expected: both pass.

- [ ] **Step 1.7: Commit**

```bash
git add packages/frameworks/react-vscode/src/checkbox/
git commit -s -m "refactor(checkbox): add hint and error-text parts"
```

---

## Task 2: progress — add error-text, hint, context; extend Simple

**Files:**
- Create: `packages/frameworks/react-vscode/src/progress/progress-error-text.tsx`
- Create: `packages/frameworks/react-vscode/src/progress/progress-hint.tsx`
- Create: `packages/frameworks/react-vscode/src/progress/progress-context.tsx`
- Rename: `packages/frameworks/react-vscode/src/progress/progress-value.tsx` → `progress-value-text.tsx`
- Modify: `packages/frameworks/react-vscode/src/progress/progress.tsx` (Simple)
- Modify: `packages/frameworks/react-vscode/src/progress/index.ts`
- Modify: `packages/frameworks/react-vscode/src/progress/vs-progress.css`

**QDS ref:** `packages/frameworks/react/src/progress/`.

- [ ] **Step 2.1: Create `progress-hint.tsx`**

```tsx
import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressHintProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ProgressHintProps extends CoreProgressHintProps {}

export function ProgressHint(props: ProgressHintProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress__hint"}, props)
  return <CoreProgress.Hint {...mergedProps} />
}
```

- [ ] **Step 2.2: Create `progress-error-text.tsx`**

```tsx
import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressErrorTextProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ProgressErrorTextProps extends CoreProgressErrorTextProps {}

export function ProgressErrorText(props: ProgressErrorTextProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress__error-text"}, props)
  return <CoreProgress.ErrorText {...mergedProps} />
}
```

- [ ] **Step 2.3: Create `progress-context.tsx`**

```tsx
import type {ReactNode} from "react"

import type {ProgressApi} from "@qualcomm-ui/core/progress"
import {useProgressContext} from "@qualcomm-ui/react-core/progress"
import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"

export interface ProgressContextProps {
  children: RenderProp<ProgressApi>
}

/**
 * Render prop that provides the current progress API context.
 */
export function ProgressContext({children}: ProgressContextProps): ReactNode {
  const context = useProgressContext()
  return renderProp(children, context)
}
```

- [ ] **Step 2.4: Rename `progress-value.tsx` → `progress-value-text.tsx` and update exports**

```bash
git mv packages/frameworks/react-vscode/src/progress/progress-value.tsx \
       packages/frameworks/react-vscode/src/progress/progress-value-text.tsx
```

Edit `progress-value-text.tsx`: rename export `ProgressValue` → `ProgressValueText`, `ProgressValueProps` → `ProgressValueTextProps`. Keep its body using `CoreProgress.ValueText` and `{className: "vs-progress__value-text"}`.

Replace the file contents with:

```tsx
import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressValueTextProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export type ProgressValueTextProps = CoreProgressValueTextProps & {
  children?: ReactNode
}

export function ProgressValueText({
  children,
  ...props
}: ProgressValueTextProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress__value-text"}, props)
  return <CoreProgress.ValueText {...mergedProps}>{children}</CoreProgress.ValueText>
}
```

(Confirm the CSS class previously applied was `vs-progress__value`; rename to `vs-progress__value-text` in both the source CSS and any usages, OR keep `vs-progress__value` if a grep shows external consumers — default: rename.)

- [ ] **Step 2.5: Rewrite Simple `progress.tsx`**

Replace the file contents with:

```tsx
import type {ReactElement, ReactNode} from "react"

import {ProgressBar, type ProgressBarProps} from "./progress-bar"
import {
  ProgressErrorText,
  type ProgressErrorTextProps,
} from "./progress-error-text"
import {ProgressHint, type ProgressHintProps} from "./progress-hint"
import {ProgressLabel, type ProgressLabelProps} from "./progress-label"
import {ProgressRoot, type ProgressRootProps} from "./progress-root"
import {ProgressTrack, type ProgressTrackProps} from "./progress-track"
import {
  ProgressValueText,
  type ProgressValueTextProps,
} from "./progress-value-text"

/**
 * A progress indicator with a simplified API.
 */
export interface ProgressProps extends ProgressRootProps {
  barProps?: ProgressBarProps
  errorText?: ReactNode
  errorTextProps?: ProgressErrorTextProps
  hint?: ReactNode
  hintProps?: ProgressHintProps
  label?: ReactNode
  labelProps?: ProgressLabelProps
  trackProps?: ProgressTrackProps
  valueText?: ReactNode
  valueTextProps?: ProgressValueTextProps
}

export function Progress({
  barProps,
  errorText,
  errorTextProps,
  hint,
  hintProps,
  label,
  labelProps,
  trackProps,
  valueText,
  valueTextProps,
  ...props
}: ProgressProps): ReactElement {
  const labelContent = label || labelProps?.children
  const valueTextContent = valueText || valueTextProps?.children
  const hintContent = hint || hintProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  return (
    <ProgressRoot {...props}>
      {labelContent ? (
        <ProgressLabel {...labelProps}>{labelContent}</ProgressLabel>
      ) : null}
      {valueTextContent ? (
        <ProgressValueText {...valueTextProps}>{valueTextContent}</ProgressValueText>
      ) : null}
      <ProgressTrack {...trackProps}>
        <ProgressBar {...barProps} />
      </ProgressTrack>
      {hintContent ? <ProgressHint {...hintProps}>{hintContent}</ProgressHint> : null}
      {errorTextContent ? (
        <ProgressErrorText {...errorTextProps}>{errorTextContent}</ProgressErrorText>
      ) : null}
    </ProgressRoot>
  )
}
```

- [ ] **Step 2.6: Rewrite `index.ts`**

Replace the file contents with:

```ts
import {Progress as SimpleProgress} from "./progress"
import {ProgressBar, type ProgressBarProps} from "./progress-bar"
import {ProgressContext, type ProgressContextProps} from "./progress-context"
import {
  ProgressErrorText,
  type ProgressErrorTextProps,
} from "./progress-error-text"
import {ProgressHint, type ProgressHintProps} from "./progress-hint"
import {ProgressLabel, type ProgressLabelProps} from "./progress-label"
import {ProgressRoot, type ProgressRootProps} from "./progress-root"
import {ProgressTrack, type ProgressTrackProps} from "./progress-track"
import {
  ProgressValueText,
  type ProgressValueTextProps,
} from "./progress-value-text"

export type {
  ProgressBarProps,
  ProgressContextProps,
  ProgressErrorTextProps,
  ProgressHintProps,
  ProgressLabelProps,
  ProgressRootProps,
  ProgressTrackProps,
  ProgressValueTextProps,
}

type ProgressComponent = typeof SimpleProgress & {
  Bar: typeof ProgressBar
  Context: typeof ProgressContext
  ErrorText: typeof ProgressErrorText
  Hint: typeof ProgressHint
  Label: typeof ProgressLabel
  Root: typeof ProgressRoot
  Track: typeof ProgressTrack
  ValueText: typeof ProgressValueText
}

export const Progress: ProgressComponent = SimpleProgress as ProgressComponent

Progress.Bar = ProgressBar
Progress.Context = ProgressContext
Progress.ErrorText = ProgressErrorText
Progress.Hint = ProgressHint
Progress.Label = ProgressLabel
Progress.Root = ProgressRoot
Progress.Track = ProgressTrack
Progress.ValueText = ProgressValueText
```

- [ ] **Step 2.7: Update CSS**

In `vs-progress.css`, rename `.vs-progress__value` → `.vs-progress__value-text` and append:

```css
.vs-progress__hint {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-font-size);
  margin-top: 4px;
}

.vs-progress__error-text {
  color: var(--vscode-errorForeground);
  font-size: var(--vscode-font-size);
  margin-top: 4px;
}
```

- [ ] **Step 2.8: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
git add packages/frameworks/react-vscode/src/progress/
git commit -s -m "refactor(progress): add hint, error-text, context; rename value → value-text"
```

---

## Task 3: progress-circle — expand parts, extend Simple

**Files:**
- Create: `progress-circle-bar.tsx`, `progress-circle-track.tsx`, `progress-circle-value-text.tsx`, `progress-circle-error-text.tsx`, `progress-circle-circle-container.tsx`
- Modify: `progress-circle.tsx` (Simple), `index.ts`, `vs-progress-circle.css`
- Review: `progress-circle-context.ts` (keep local ring sizing context; confirm it doesn't overlap `CoreProgress.Context`)

**QDS ref:** `packages/frameworks/react/src/progress-ring/` — use the `progress-ring-*` files as templates, substituting `ProgressCircle` names for `ProgressRing` names and `vs-progress-circle__*` classes for `qds-progress-ring__*`.

- [ ] **Step 3.1: Read QDS `progress-ring-bar.tsx`, `-track`, `-value-text`, `-error-text`, `-circle-container`**

```bash
ls packages/frameworks/react/src/progress-ring/
```

For each `progress-ring-<part>.tsx` file, create `progress-circle-<part>.tsx` in the VSCode package, applying the Adaptation Recipe:
- Replace class prefix `qds-progress-ring` → `vs-progress-circle`.
- Remove `useQdsProgressRingContext()` calls.
- Rename exports `ProgressRingBar` → `ProgressCircleBar`, etc.
- Replace Core prop type import `CoreProgressRingBarProps` with `CoreProgressRingBarProps` (same import from `@qualcomm-ui/react-core/progress-ring`).

- [ ] **Step 3.2: Create `progress-circle-bar.tsx`**

```tsx
import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingBarProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ProgressCircleBarProps extends CoreProgressRingBarProps {}

export function ProgressCircleBar(props: ProgressCircleBarProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress-circle__bar"}, props)
  return <CoreProgressRing.Bar {...mergedProps} />
}
```

- [ ] **Step 3.3: Create `progress-circle-track.tsx`**

```tsx
import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingTrackProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ProgressCircleTrackProps extends CoreProgressRingTrackProps {}

export function ProgressCircleTrack(props: ProgressCircleTrackProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress-circle__track"}, props)
  return <CoreProgressRing.Track {...mergedProps} />
}
```

- [ ] **Step 3.4: Create `progress-circle-value-text.tsx`**

```tsx
import type {ReactElement, ReactNode} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingValueTextProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export type ProgressCircleValueTextProps = CoreProgressRingValueTextProps & {
  children?: ReactNode
}

export function ProgressCircleValueText({
  children,
  ...props
}: ProgressCircleValueTextProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-progress-circle__value-text"},
    props,
  )
  return (
    <CoreProgressRing.ValueText {...mergedProps}>
      {children}
    </CoreProgressRing.ValueText>
  )
}
```

- [ ] **Step 3.5: Create `progress-circle-error-text.tsx`**

```tsx
import type {ReactElement, ReactNode} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingErrorTextProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export type ProgressCircleErrorTextProps = CoreProgressRingErrorTextProps & {
  children?: ReactNode
}

export function ProgressCircleErrorText({
  children,
  ...props
}: ProgressCircleErrorTextProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-progress-circle__error-text"},
    props,
  )
  return (
    <CoreProgressRing.ErrorText {...mergedProps}>
      {children}
    </CoreProgressRing.ErrorText>
  )
}
```

- [ ] **Step 3.6: Create `progress-circle-circle-container.tsx` per QDS peer**

Mirror `packages/frameworks/react/src/progress-ring/progress-ring-circle-container.tsx` verbatim through the Adaptation Recipe.

- [ ] **Step 3.7: Extend Simple `progress-circle.tsx`**

Follow QDS `progress-ring.tsx` structure. Add `hint?`, `hintProps?`, `errorText?`, `errorTextProps?`, `valueText?`, `valueTextProps?`, `trackProps?`, `circleContainerProps?`, `barProps?` props. Render optional children sections inside `<ProgressCircleRoot>`.

(Use `packages/frameworks/react/src/progress-ring/progress-ring.tsx` as the canonical reference and rename every `ProgressRing` → `ProgressCircle`.)

- [ ] **Step 3.8: Update `index.ts`**

Export all new parts and attach them to a `ProgressCircle` namespace object matching QDS `progress-ring/index.ts` structure.

- [ ] **Step 3.9: Update CSS**

Append to `vs-progress-circle.css`:

```css
.vs-progress-circle__bar {
  /* existing bar styles — consolidate any inline styles from progress-circle-circle.tsx */
}
.vs-progress-circle__track {
  /* track ring styling */
}
.vs-progress-circle__value-text {
  color: var(--vscode-foreground);
  font-size: var(--vscode-font-size);
}
.vs-progress-circle__error-text {
  color: var(--vscode-errorForeground);
  font-size: var(--vscode-font-size);
}
.vs-progress-circle__circle-container {
  /* SVG container rules per QDS peer */
}
```

Adjust rules to match the visual from the existing `progress-circle-circle.tsx` inline logic. If existing CSS has equivalent rules under different selectors, reuse them.

- [ ] **Step 3.10: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
git add packages/frameworks/react-vscode/src/progress-circle/
git commit -s -m "refactor(progress-circle): expand compound parts and Simple API"
```

---

## Task 4: tabs — add Indicator, DismissButton, Context; split files

**Files:**
- Rename: `tabs.tsx` → `tabs-root.tsx`; rename `tab.tsx` → `tab-root.tsx` (split the TabButton inline portion into its own file)
- Create: `tabs-indicator.tsx`, `tabs-context.tsx`, `tab-button.tsx`, `tab-dismiss-button.tsx`
- Modify: `index.ts` — add `Tabs` and `Tab` two-namespace exports
- Modify: `vs-tabs.css`

**QDS ref:** `packages/frameworks/react/src/tabs/tabs/` (5 files) and `packages/frameworks/react/src/tabs/tab/` (3 files). Note: QDS uses nested directories; keep a flat layout in react-vscode for consistency with existing files.

- [ ] **Step 4.1: Rename `tabs.tsx` → `tabs-root.tsx`**

```bash
git mv packages/frameworks/react-vscode/src/tabs/tabs.tsx \
       packages/frameworks/react-vscode/src/tabs/tabs-root.tsx
```
Rename the exported symbol `Tabs` → `TabsRoot` inside the file. Update all `vs-tabs` class usages to reflect `__root` if QDS peer uses one; otherwise keep `vs-tabs`.

- [ ] **Step 4.2: Split `tab.tsx` into `tab-root.tsx` + `tab-button.tsx`**

The current `tab.tsx` bundles `<CoreTabs.Tab>` and `<CoreTabs.TabButton>` inline. Split per QDS:
- `tab-root.tsx` wraps `<CoreTabs.Tab>` only, forwarding `value` / `disabled` props and applying `vs-tabs__tab` class.
- `tab-button.tsx` wraps `<CoreTabs.TabButton>`, applying any vs-specific child rendering (the current inline `{isSelected ? <div className="vs-tabs__bar" /> : null}` logic moves into `tab-button.tsx`).

Follow QDS `tabs/tab/tab-root.tsx` and `tabs/tab/tab-button.tsx` as templates.

- [ ] **Step 4.3: Create `tabs-indicator.tsx`**

Mirror `packages/frameworks/react/src/tabs/tabs/tabs-indicator.tsx` minus QDS styling, applying `{className: "vs-tabs__indicator"}`.

- [ ] **Step 4.4: Create `tabs-context.tsx`**

Mirror `packages/frameworks/react/src/tabs/tabs/tabs-context.tsx` verbatim through the Adaptation Recipe (renders a render-prop providing tabs API context, no JSX class needed).

- [ ] **Step 4.5: Create `tab-dismiss-button.tsx`**

Mirror `packages/frameworks/react/src/tabs/tab/tab-dismiss-button.tsx` minus QDS styling, applying `{className: "vs-tabs__tab-dismiss-button"}`.

- [ ] **Step 4.6: Rewrite `index.ts` with two-namespace exports**

```ts
import {TabRoot, type TabRootProps} from "./tab-root"
import {TabButton, type TabButtonProps} from "./tab-button"
import {TabDismissButton, type TabDismissButtonProps} from "./tab-dismiss-button"
import {TabLabel, type TabLabelProps} from "./tab-label"
import {TabsRoot, type TabsRootProps} from "./tabs-root"
import {TabsList, type TabsListProps} from "./tab-list"
import {TabsPanel, type TabsPanelProps} from "./tab-panel"
import {TabsIndicator, type TabsIndicatorProps} from "./tabs-indicator"
import {TabsContext, type TabsContextProps} from "./tabs-context"

export type {
  TabRootProps, TabButtonProps, TabDismissButtonProps, TabLabelProps,
  TabsRootProps, TabsListProps, TabsPanelProps, TabsIndicatorProps, TabsContextProps,
}

type TabComponent = {
  Root: typeof TabRoot
  Button: typeof TabButton
  DismissButton: typeof TabDismissButton
  Label: typeof TabLabel
}
export const Tab: TabComponent = {
  Root: TabRoot,
  Button: TabButton,
  DismissButton: TabDismissButton,
  Label: TabLabel,
}

type TabsComponent = {
  Root: typeof TabsRoot
  List: typeof TabsList
  Panel: typeof TabsPanel
  Indicator: typeof TabsIndicator
  Context: typeof TabsContext
}
export const Tabs: TabsComponent = {
  Root: TabsRoot,
  List: TabsList,
  Panel: TabsPanel,
  Indicator: TabsIndicator,
  Context: TabsContext,
}
```

(Confirm `tab-list.tsx` and `tab-panel.tsx` export `TabsList` / `TabsPanel` — the existing files may use different export names. Rename the exported symbols to match the QDS convention if needed.)

- [ ] **Step 4.7: Update CSS**

Append to `vs-tabs.css`:

```css
.vs-tabs__indicator { /* bar/indicator style, reuse from existing .vs-tabs__bar if appropriate */ }
.vs-tabs__tab-dismiss-button { /* close-X styling */ }
```

- [ ] **Step 4.8: Update demos**

Demos currently import `Tabs, Tab, TabList, TabPanel, TabLabel` or similar. Grep and update:

```bash
grep -rn "from \"@qualcomm-ui/react-vscode/tabs\"" packages/docs/react-vscode-docs/
```

Switch named imports to `{Tabs, Tab}` namespaces where idiomatic. If existing demos use a specific symbol that was renamed (e.g., `Tabs` at top level → now `Tabs.Root`), update them.

- [ ] **Step 4.9: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
pnpm --filter @qualcomm-ui/react-vscode-docs build
git add packages/frameworks/react-vscode/src/tabs/ packages/docs/react-vscode-docs/src/routes/components+/tabs+/
git commit -s -m "refactor(tabs): add indicator, dismiss-button, context; split root/button"
```

---

## Task 5: stepper — add 7 missing parts + Context

**Files:**
- Create: `step-label.tsx`, `step-indicator-icon.tsx`, `step-content.tsx`, `step-completed-content.tsx`, `step-next-trigger.tsx`, `step-prev-trigger.tsx`, `step-hint.tsx`, `steps-context.tsx`
- Modify: `index.ts`
- Modify: `vs-steps.css`

**QDS ref:** `packages/frameworks/react/src/stepper/`.

- [ ] **Step 5.1: Create each of the 8 new parts**

For each QDS file `stepper-<part>.tsx`, create the VSCode counterpart `step-<part>.tsx` (or `steps-<part>.tsx` for root-level parts like context) with the Adaptation Recipe applied:

- Import `CoreStepper` / `CoreStepper<Part>Props` from `@qualcomm-ui/react-core/stepper`.
- Drop QDS stepper context.
- Apply `{className: "vs-steps__<part>"}`.
- Mirror the prop shape exactly.

Reference files to mirror (map):

| QDS file | VSCode file | VSCode class |
|---|---|---|
| `stepper-label.tsx` | `step-label.tsx` | `vs-steps__label` |
| `stepper-indicator-icon.tsx` | `step-indicator-icon.tsx` | `vs-steps__indicator-icon` |
| `stepper-content.tsx` | `step-content.tsx` | `vs-steps__content` |
| `stepper-completed-content.tsx` | `step-completed-content.tsx` | `vs-steps__completed-content` |
| `stepper-next-trigger.tsx` | `step-next-trigger.tsx` | `vs-steps__next-trigger` |
| `stepper-prev-trigger.tsx` | `step-prev-trigger.tsx` | `vs-steps__prev-trigger` |
| `stepper-hint.tsx` | `step-hint.tsx` | `vs-steps__hint` |
| `stepper-context.ts` | `steps-context.tsx` | (no class; render-prop) |

- [ ] **Step 5.2: Rewrite `index.ts`**

Export every existing part plus the new ones, attached to a `Steps` namespace object (keep the `Step*` naming convention).

```ts
import {StepsRoot, type StepsRootProps} from "./steps-root"
import {StepList, type StepListProps} from "./step-list"
import {StepItem, type StepItemProps} from "./step-item"
import {StepTrigger, type StepTriggerProps} from "./step-trigger"
import {StepIndicator, type StepIndicatorProps} from "./step-indicator"
import {StepIndicatorIcon, type StepIndicatorIconProps} from "./step-indicator-icon"
import {StepSeparator, type StepSeparatorProps} from "./step-separator"
import {StepLabel, type StepLabelProps} from "./step-label"
import {StepContent, type StepContentProps} from "./step-content"
import {StepCompletedContent, type StepCompletedContentProps} from "./step-completed-content"
import {StepNextTrigger, type StepNextTriggerProps} from "./step-next-trigger"
import {StepPrevTrigger, type StepPrevTriggerProps} from "./step-prev-trigger"
import {StepHint, type StepHintProps} from "./step-hint"
import {StepsContext, type StepsContextProps} from "./steps-context"

export type {
  StepsRootProps, StepListProps, StepItemProps, StepTriggerProps,
  StepIndicatorProps, StepIndicatorIconProps, StepSeparatorProps,
  StepLabelProps, StepContentProps, StepCompletedContentProps,
  StepNextTriggerProps, StepPrevTriggerProps, StepHintProps, StepsContextProps,
}

type StepsComponent = {
  Root: typeof StepsRoot
  List: typeof StepList
  Item: typeof StepItem
  Trigger: typeof StepTrigger
  Indicator: typeof StepIndicator
  IndicatorIcon: typeof StepIndicatorIcon
  Separator: typeof StepSeparator
  Label: typeof StepLabel
  Content: typeof StepContent
  CompletedContent: typeof StepCompletedContent
  NextTrigger: typeof StepNextTrigger
  PrevTrigger: typeof StepPrevTrigger
  Hint: typeof StepHint
  Context: typeof StepsContext
}

export const Steps: StepsComponent = {
  Root: StepsRoot, List: StepList, Item: StepItem, Trigger: StepTrigger,
  Indicator: StepIndicator, IndicatorIcon: StepIndicatorIcon, Separator: StepSeparator,
  Label: StepLabel, Content: StepContent, CompletedContent: StepCompletedContent,
  NextTrigger: StepNextTrigger, PrevTrigger: StepPrevTrigger, Hint: StepHint, Context: StepsContext,
}
```

- [ ] **Step 5.3: Update CSS**

Append to `vs-steps.css`:

```css
.vs-steps__label { font-size: var(--vscode-font-size); color: var(--vscode-foreground); }
.vs-steps__indicator-icon { display: inline-flex; }
.vs-steps__content { /* panel styling per QDS ref */ }
.vs-steps__completed-content { /* finished state panel */ }
.vs-steps__next-trigger, .vs-steps__prev-trigger { /* VS Code-style navigation buttons */ }
.vs-steps__hint { color: var(--vscode-descriptionForeground); font-size: var(--vscode-font-size); }
```

- [ ] **Step 5.4: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
git add packages/frameworks/react-vscode/src/steps/
git commit -s -m "refactor(steps): add label, indicator-icon, content, triggers, hint, context"
```

---

## Task 6: tooltip — split compound + rebuild Simple

**Files:**
- Rename: `tooltip.tsx` → `tooltip-root.tsx` (current contents = Root logic)
- Create (new `tooltip.tsx`): Simple API aggregator
- Create: `tooltip-positioner.tsx`, `tooltip-arrow.tsx`, `tooltip-arrow-tip.tsx`
- Modify: `tooltip-trigger.tsx`, `tooltip-content.tsx` to match QDS Patterns B/A
- Modify: `index.ts`
- Modify: `vs-tooltip.css`

**QDS ref:** `packages/frameworks/react/src/tooltip/`.

- [ ] **Step 6.1: Rename existing `tooltip.tsx` → `tooltip-root.tsx`**

```bash
git mv packages/frameworks/react-vscode/src/tooltip/tooltip.tsx \
       packages/frameworks/react-vscode/src/tooltip/tooltip-root.tsx
```
Rename the exported function `Tooltip` → `TooltipRoot` and the type `TooltipProps` → `TooltipRootProps` inside the file.

- [ ] **Step 6.2: Create `tooltip-positioner.tsx`, `-arrow.tsx`, `-arrow-tip.tsx`**

Mirror `packages/frameworks/react/src/tooltip/tooltip-positioner.tsx`, `-arrow.tsx`, `-arrow-tip.tsx` through the Adaptation Recipe. Apply classes `vs-tooltip__positioner`, `vs-tooltip__arrow`, `vs-tooltip__arrow-tip`.

- [ ] **Step 6.3: Update `tooltip-trigger.tsx` and `tooltip-content.tsx`**

Check each file against the QDS peer. They should already be close; verify they use `useTooltipTrigger` / `useTooltipContent` from `@qualcomm-ui/react-core/tooltip` and apply `vs-tooltip__trigger` (if applicable) / `vs-tooltip__content` classes.

- [ ] **Step 6.4: Create new Simple `tooltip.tsx`**

Mirror `packages/frameworks/react/src/tooltip/tooltip.tsx`. Adapt by removing QDS context and keeping the prop shape: `trigger: BindingRenderProp<TooltipTriggerBindings>`, `children: ReactNode`, `hideArrow?: boolean`, `arrowProps?`, `arrowTipProps?`, `contentProps?`, `portalProps?`, `positionerProps?`, plus `TooltipRootProps`.

- [ ] **Step 6.5: Rewrite `index.ts` with namespace**

Export `TooltipRoot, TooltipTrigger, TooltipContent, TooltipPositioner, TooltipArrow, TooltipArrowTip`, the simple `Tooltip` function, and a `Tooltip` namespace object. Pattern identical to checkbox/progress.

- [ ] **Step 6.6: Update CSS**

Append to `vs-tooltip.css`:

```css
.vs-tooltip__positioner { z-index: 100; }
.vs-tooltip__arrow { /* QDS peer for rules */ }
.vs-tooltip__arrow-tip { /* QDS peer for rules */ }
```

Match VS Code's hover tooltip visuals. Reference the current `.vs-tooltip` rules and extend.

- [ ] **Step 6.7: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
git add packages/frameworks/react-vscode/src/tooltip/
git commit -s -m "refactor(tooltip): split root/positioner/arrow/arrow-tip; rebuild Simple"
```

---

## Task 7: popover — new generic compound

**Files:**
- Create directory: `packages/frameworks/react-vscode/src/popover/`
- Create: `popover-root.tsx`, `popover-trigger.tsx`, `popover-content.tsx`, `popover-positioner.tsx`, `popover-anchor.tsx`, `popover-arrow.tsx`, `popover-arrow-tip.tsx`, `popover-close-trigger.tsx`, `popover-description.tsx`, `popover-indicator.tsx`, `popover-label.tsx`, `popover.tsx` (Simple), `index.ts`, `vs-popover.css`

**QDS ref:** `packages/frameworks/react/src/popover/`.

- [ ] **Step 7.1: Create directory and starter CSS**

```bash
mkdir -p packages/frameworks/react-vscode/src/popover
```

Create `vs-popover.css`:

```css
.vs-popover {
  background: var(--vscode-editorHoverWidget-background);
  border: 1px solid var(--vscode-editorHoverWidget-border);
  border-radius: 5px;
  box-sizing: border-box;
  color: var(--vscode-editorHoverWidget-foreground);
  padding: 0;
  outline: none;
}

.vs-popover__positioner { z-index: 100; }
.vs-popover__arrow { /* shape rules */ }
.vs-popover__arrow-tip { /* shape rules */ }
.vs-popover__label { font-weight: 600; padding: 4px 8px; }
.vs-popover__description { padding: 4px 8px; color: var(--vscode-descriptionForeground); }
.vs-popover__close-trigger { /* close-X button */ }
```

(Use `packages/frameworks/react-vscode/src/overlay-panel/vs-overlay-panel.css` as a starting point for visual values since overlay-panel already targets this visual.)

- [ ] **Step 7.2: Create each compound part**

For each of the 12 files, mirror the QDS `popover-<part>.tsx` through the Adaptation Recipe. Apply `{className: "vs-popover[__<part>]"}` in mergeProps chains. Do not rename types.

- [ ] **Step 7.3: Create Simple `popover.tsx`**

Mirror `packages/frameworks/react/src/popover/popover.tsx`. Same prop shape: `trigger`, `children`, `hideArrow`, `arrowProps`, `contentProps`, `positionerProps`, etc.

- [ ] **Step 7.4: Create `index.ts`**

Export all parts + `Popover` namespace (same pattern as other tasks).

- [ ] **Step 7.5: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
git add packages/frameworks/react-vscode/src/popover/
git commit -s -m "feat(popover): add generic popover compound"
```

---

## Task 8: overlay-panel — delete, redirect to popover

**Files:**
- Delete: `packages/frameworks/react-vscode/src/overlay-panel/` (directory)
- Delete: `packages/docs/react-vscode-docs/src/routes/components+/overlay-panel+/` (directory)
- Create: `packages/docs/react-vscode-docs/src/routes/components+/popover+/_popover.mdx`
- Create: `packages/docs/react-vscode-docs/src/routes/components+/popover+/demos/popover-showcase-demo.tsx`
- Create: `packages/docs/react-vscode-docs/src/routes/components+/popover+/demos/index.ts`
- Modify: `packages/common/tailwind-plugin/src/qui-vscode.css` (remove `.vs-overlay-panel*` rules if the CSS is hand-edited; or regenerate if source-CSS-driven)

- [ ] **Step 8.1: Sweep for any other consumers**

```bash
grep -rn "overlay-panel\|OverlayPanel" packages/ --include="*.ts" --include="*.tsx" --include="*.mdx"
```
Record every hit — the migration needs to update each one.

- [ ] **Step 8.2: Create `components+/popover+/demos/popover-showcase-demo.tsx`**

```tsx
import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@qualcomm-ui/react-vscode/popover"

export function PopoverShowcaseDemo(): ReactNode {
  return (
    <Popover>
      <PopoverTrigger>
        {(bindings) => <Button {...bindings}>Default</Button>}
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex place-items-center p-2">Panel content</div>
      </PopoverContent>
    </Popover>
  )
}
```

- [ ] **Step 8.3: Create `components+/popover+/demos/index.ts`**

```ts
export * from "./popover-showcase-demo"
```

- [ ] **Step 8.4: Create `components+/popover+/_popover.mdx`**

Copy `overlay-panel+/_overlay-panel.mdx`, replace all "OverlayPanel" → "Popover", "overlay-panel" → "popover". Update the demo reference to `PopoverShowcaseDemo`. Retain the intro paragraph style.

- [ ] **Step 8.5: Delete old directories**

```bash
git rm -r packages/frameworks/react-vscode/src/overlay-panel/
git rm -r packages/docs/react-vscode-docs/src/routes/components+/overlay-panel+/
```

- [ ] **Step 8.6: Regenerate tailwind plugin CSS (if applicable)**

```bash
pnpm --filter @qualcomm-ui/tailwind-plugin build 2>&1 | head -20
```

If `qui-vscode.css` contains `.vs-overlay-panel*` rules, remove them from the source (either the generator script's input or the hand-edited file) and regenerate.

- [ ] **Step 8.7: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode build
pnpm --filter @qualcomm-ui/react-vscode-docs build
grep -rn "overlay-panel\|OverlayPanel" packages/  # should return no hits
git add -A
git commit -s -m "refactor(overlay-panel): remove component, redirect demos to popover"
```

---

## Task 9: menu — rebuild on react-core/menu with full compound surface

**Files:**
- Delete: `packages/frameworks/react-vscode/src/menu/menu.tsx`
- Create: 23 new files — `menu-root.tsx`, `menu-trigger.tsx`, `menu-content.tsx`, `menu-positioner.tsx`, `menu-separator.tsx`, `menu-item-group.tsx`, `menu-item-group-label.tsx`, `menu-item-label.tsx`, `menu-item-description.tsx`, `menu-item-command.tsx`, `menu-item-accessory.tsx`, `menu-item-indicator.tsx`, `menu-item-start-icon.tsx`, `menu-checkbox-item.tsx`, `menu-checkbox-item-control.tsx`, `menu-radio-item.tsx`, `menu-radio-item-control.tsx`, `menu-radio-item-group.tsx`, `menu-trigger-item.tsx`, `menu-context-trigger.tsx`, `menu-button.tsx`, `menu-icon-button.tsx`, `menu-inline-icon-button.tsx`
- Rewrite: `menu-item.tsx`, `index.ts`, `vs-menu.css`

**QDS ref:** `packages/frameworks/react/src/menu/` (full directory).

- [ ] **Step 9.1: Delete the old bundled `menu.tsx`**

```bash
git rm packages/frameworks/react-vscode/src/menu/menu.tsx
```

- [ ] **Step 9.2: Create `menu-root.tsx` (Pattern A)**

```tsx
import {type ReactElement, type ReactNode} from "react"

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

export interface MenuRootProps
  extends Optional<MenuApiProps, "id">, PresenceApiProps {
  children: ReactNode
}

export function MenuRoot({children, ...props}: MenuRootProps): ReactElement {
  const [presenceProps, menuProps] = splitPresenceProps(props)
  const {api, machine, triggerItemContext} = useMenu(menuProps)
  const presenceApi = usePresence(
    mergeProps({present: api.open}, presenceProps),
  )
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

- [ ] **Step 9.3: Create `menu-trigger.tsx` (Pattern B, render-prop)**

```tsx
import type {ReactNode} from "react"

import type {MenuTriggerBindings} from "@qualcomm-ui/core/menu"
import {useMenuTrigger} from "@qualcomm-ui/react-core/menu"
import {
  type BindingRenderProp,
  bindingRenderProp,
} from "@qualcomm-ui/react-core/system"

export interface MenuTriggerProps {
  children: BindingRenderProp<MenuTriggerBindings>
  id?: string
}

export function MenuTrigger({children, id}: MenuTriggerProps): ReactNode {
  const bindings = useMenuTrigger({id})
  return bindingRenderProp(children, bindings)
}
```

- [ ] **Step 9.4: Create `menu-content.tsx`**

```tsx
import type {ReactElement, ReactNode} from "react"

import {useMenuContent} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuContentProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuContent({
  children,
  id,
  ...props
}: MenuContentProps): ReactElement | null {
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

- [ ] **Step 9.5: Rewrite `menu-item.tsx` (Pattern C — the carbon-copy fix)**

```tsx
import type {ReactElement, ReactNode} from "react"

import {type ItemProps, splitMenuItemProps} from "@qualcomm-ui/core/menu"
import {
  MenuItemContextProvider,
  useMenuItem,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {type CodiconOrElement, IconOrElement} from "../icon"

export interface MenuItemProps
  extends ItemProps, Omit<ElementRenderProp<"button">, "onSelect" | "value"> {
  children?: ReactNode
  endIcon?: CodiconOrElement
  startIcon?: CodiconOrElement
}

export function MenuItem({
  children,
  endIcon,
  startIcon,
  ...props
}: MenuItemProps): ReactElement {
  const [menuItemProps, localProps] = splitMenuItemProps(props)
  const {bindings, itemContextValue} = useMenuItem(menuItemProps)
  const mergedProps = mergeProps(
    bindings,
    {className: "vs-menu-item"},
    localProps,
  )
  return (
    <MenuItemContextProvider value={itemContextValue}>
      <PolymorphicElement as="button" {...mergedProps}>
        {startIcon ? <IconOrElement icon={startIcon} /> : <span />}
        {children}
        {endIcon ? (
          <IconOrElement className="vs-menu-item__end-icon" icon={endIcon} />
        ) : null}
      </PolymorphicElement>
    </MenuItemContextProvider>
  )
}
```

- [ ] **Step 9.6: Create remaining 20 parts**

For each QDS file `packages/frameworks/react/src/menu/<part>.tsx`, create the VSCode counterpart through the Adaptation Recipe. Use class `vs-menu__<part>` (e.g., `vs-menu__item-group`, `vs-menu__separator`, `vs-menu__item-indicator`, `vs-menu__item-label`, etc.).

Files:
- `menu-positioner.tsx`
- `menu-separator.tsx`
- `menu-item-group.tsx`, `menu-item-group-label.tsx`, `menu-item-label.tsx`, `menu-item-description.tsx`, `menu-item-command.tsx`, `menu-item-accessory.tsx`, `menu-item-indicator.tsx`, `menu-item-start-icon.tsx`
- `menu-checkbox-item.tsx`, `menu-checkbox-item-control.tsx`
- `menu-radio-item.tsx`, `menu-radio-item-control.tsx`, `menu-radio-item-group.tsx`
- `menu-trigger-item.tsx`, `menu-context-trigger.tsx`
- `menu-button.tsx`, `menu-icon-button.tsx`, `menu-inline-icon-button.tsx`

For each: open the QDS peer, apply the Adaptation Recipe, save.

- [ ] **Step 9.7: Rewrite `index.ts`**

Mirror `packages/frameworks/react/src/menu/index.ts` structure: type re-exports, `MenuComponent` type describing the namespace, `Menu` namespace const assigning every part. Remove `export * from "./qds-menu-context"` equivalent (not applicable for VSCode).

- [ ] **Step 9.8: Update CSS**

Append to `vs-menu.css`:

```css
.vs-menu__positioner { z-index: 100; }
.vs-menu__separator { border-top: 1px solid var(--vscode-menu-separatorBackground); margin: 4px 0; }
.vs-menu__item-group { display: flex; flex-direction: column; }
.vs-menu__item-group-label {
  color: var(--vscode-descriptionForeground);
  font-size: var(--vscode-font-size);
  padding: 2px 8px;
  text-transform: uppercase;
}
.vs-menu__item-label { flex: 1; }
.vs-menu__item-description { color: var(--vscode-descriptionForeground); }
.vs-menu__item-command {
  color: var(--vscode-descriptionForeground);
  margin-left: auto;
  font-family: var(--vscode-editor-font-family);
  font-size: calc(var(--vscode-font-size) - 1px);
}
.vs-menu__item-accessory { margin-left: auto; }
.vs-menu__item-indicator { display: inline-flex; margin-right: 6px; }
.vs-menu__item-start-icon { margin-right: 6px; }
.vs-menu__checkbox-item, .vs-menu__radio-item { /* extend .vs-menu-item */ }
.vs-menu__checkbox-item-control, .vs-menu__radio-item-control {
  display: inline-flex; margin-right: 6px;
}
.vs-menu__radio-item-group { display: flex; flex-direction: column; }
```

(Adjust rules after visual inspection. Match VS Code's native menu chrome.)

- [ ] **Step 9.9: Update existing menu demo to exercise new parts**

Extend `packages/docs/react-vscode-docs/src/routes/components+/menu+/demos/menu-showcase-demo.tsx` to include at least one `Menu.Separator`, `Menu.ItemGroup`, `Menu.CheckboxItem`, and `Menu.RadioItemGroup` so the new surface is reachable from the docs.

- [ ] **Step 9.10: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
pnpm --filter @qualcomm-ui/react-vscode-docs build
git add packages/frameworks/react-vscode/src/menu/ packages/docs/react-vscode-docs/src/routes/components+/menu+/
git commit -s -m "refactor(menu): rebuild on react-core/menu with full compound surface"
```

---

## Task 10: select — rename from dropdown, absorb dropdown-input

**Files:**
- Rename dir: `src/dropdown/` → `src/select/`
- Delete: `src/select/dropdown.tsx` (after rename)
- Delete dir: `src/dropdown-input/`
- Create in `src/select/`: `select-root.tsx`, `select-control.tsx`, `select-trigger.tsx`, `select-content.tsx`, `select-positioner.tsx`, `select-item.tsx`, `select-item-text.tsx`, `select-item-indicator.tsx`, `select-item-group.tsx`, `select-item-group-label.tsx`, `select-label.tsx`, `select-hint.tsx`, `select-error-text.tsx`, `select-error-indicator.tsx`, `select-clear-trigger.tsx`, `select-hidden-select.tsx`, `select-value-text.tsx`, `select.tsx` (Simple), `index.ts`, `vs-select.css`
- Delete docs: `components+/dropdown+/`, `components+/dropdown-input+/`
- Create docs: `components+/select+/_select.mdx` + demos

**QDS ref:** `packages/frameworks/react/src/select/`.

- [ ] **Step 10.1: Sweep for all consumer imports**

```bash
grep -rn "@qualcomm-ui/react-vscode/dropdown\|@qualcomm-ui/react-vscode/dropdown-input\|from \"@qualcomm-ui/react-vscode\"[^\"]*Dropdown\|DropdownInput" packages/
```
Record every hit for update in steps 10.11-10.13.

- [ ] **Step 10.2: Rename directory and delete old bundled file**

```bash
git mv packages/frameworks/react-vscode/src/dropdown packages/frameworks/react-vscode/src/select
git rm packages/frameworks/react-vscode/src/select/dropdown.tsx
```

- [ ] **Step 10.3: Merge CSS files into `vs-select.css`**

```bash
git mv packages/frameworks/react-vscode/src/select/vs-dropdown.css \
       packages/frameworks/react-vscode/src/select/vs-select.css
```

Edit `vs-select.css`:
- Rename `.vs-dropdown` → `.vs-select` (prefix).
- Append the full contents of `packages/frameworks/react-vscode/src/dropdown-input/vs-dropdown-input.css`, renaming `.vs-dropdown-input` → `.vs-select__control` and `.vs-dropdown-input__label` → `.vs-select__control__label`, `.vs-dropdown-input__icon` → `.vs-select__control__icon`.

- [ ] **Step 10.4: Delete `src/dropdown-input/`**

```bash
git rm -r packages/frameworks/react-vscode/src/dropdown-input/
```

- [ ] **Step 10.5: Create `select-root.tsx`**

Mirror `packages/frameworks/react/src/select/select-root.tsx` through the Adaptation Recipe. Uses `useSelect` from `@qualcomm-ui/react-core/select`, wraps children in `SelectContextProvider` + `PresenceContextProvider`.

- [ ] **Step 10.6: Create `select-control.tsx` (absorbs DropdownInput)**

```tsx
import type {ReactElement, ReactNode} from "react"

import {useSelectControl} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

export type SelectControlVariant = "fill" | "ghost"

export interface SelectControlProps extends ElementRenderProp<"button"> {
  children?: ReactNode
  /**
   * Controls the component's styling.
   *
   * @default 'fill'
   */
  variant?: SelectControlVariant
}

export function SelectControl({
  children,
  variant = "fill",
  ...props
}: SelectControlProps): ReactElement {
  const bindings = useSelectControl()
  const mergedProps = mergeProps(
    bindings,
    {className: "vs-select__control", "data-variant": variant},
    props,
  )
  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {children}
      <Icon className="vs-select__control__icon" icon="chevron-down" size={12} />
    </PolymorphicElement>
  )
}
```

(Confirm `useSelectControl` exists in `@qualcomm-ui/react-core/select`; if the binding helper uses a different name like `useSelectTrigger`, adapt accordingly based on the QDS peer.)

- [ ] **Step 10.7: Create remaining compound parts**

For each of: `select-trigger`, `select-content`, `select-positioner`, `select-item`, `select-item-text`, `select-item-indicator`, `select-item-group`, `select-item-group-label`, `select-label`, `select-hint`, `select-error-text`, `select-error-indicator`, `select-clear-trigger`, `select-hidden-select`, `select-value-text` — mirror the QDS peer at `packages/frameworks/react/src/select/<name>.tsx` through the Adaptation Recipe. Apply `vs-select__<part>` classes.

- [ ] **Step 10.8: Create Simple `select.tsx`**

Mirror `packages/frameworks/react/src/select/select.tsx`. Signature: `SelectProps extends SelectRootProps` — takes `collection` directly, no `items` sugar. Assemble the compound tree: `SelectRoot > (SelectLabel?) > SelectControl > SelectValueText > SelectHiddenSelect > SelectContent.Positioner > SelectContent > SelectItem... > (SelectHint?) > (SelectErrorText?)`.

The Simple API's `<SelectControl>` is rendered internally; callers who want to customize the trigger use `controlProps={{variant: "ghost"}}` or drop down to the compound API directly.

- [ ] **Step 10.9: Create `index.ts`**

Mirror QDS `select/index.ts`. Type re-exports + `Select` namespace object + simple `Select` function.

- [ ] **Step 10.10: Migrate existing demo**

```bash
git mv packages/docs/react-vscode-docs/src/routes/components+/dropdown packages/docs/react-vscode-docs/src/routes/components+/select
```

Wait — `dropdown+` and `dropdown-input+` are separate directories. Do the rename plus the delete:

```bash
git mv packages/docs/react-vscode-docs/src/routes/components+/dropdown+ \
       packages/docs/react-vscode-docs/src/routes/components+/select+
git rm -r packages/docs/react-vscode-docs/src/routes/components+/dropdown-input+/
```

Rename files inside `select+`:

```bash
git mv packages/docs/react-vscode-docs/src/routes/components+/select+/_dropdown.mdx \
       packages/docs/react-vscode-docs/src/routes/components+/select+/_select.mdx
git mv packages/docs/react-vscode-docs/src/routes/components+/select+/demos/dropdown-showcase-demo.tsx \
       packages/docs/react-vscode-docs/src/routes/components+/select+/demos/select-showcase-demo.tsx
```

Edit the files:

`select-showcase-demo.tsx`:

```tsx
import type {ReactNode} from "react"

import {Select, SelectContent, SelectItem} from "@qualcomm-ui/react-vscode/select"
import {listCollection} from "@qualcomm-ui/core/collection"

const collection = listCollection({
  items: [
    {label: "microsoft/vscode", value: "microsoft/vscode"},
    {label: "microsoft/vscode-codicons", value: "microsoft/vscode-codicons"},
    {label: "microsoft/vscode-docs", value: "microsoft/vscode-docs"},
  ],
})

export function SelectShowcaseDemo(): ReactNode {
  return (
    <Select collection={collection}>
      <SelectContent>
        <SelectItem item={collection.items[0]}>microsoft/vscode</SelectItem>
        <SelectItem item={collection.items[1]}>microsoft/vscode-codicons</SelectItem>
        <SelectItem item={collection.items[2]}>microsoft/vscode-docs</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

(Confirm the `listCollection` helper path — check `@qualcomm-ui/core/collection` or `@qualcomm-ui/react-core/collection`. The exact invocation must match what QDS uses in its Select demos; look at `packages/frameworks/react/src/select/select.spec.tsx` or the QDS docs site for the canonical pattern.)

Update `_select.mdx`: replace every "Dropdown" with "Select", "dropdown" with "select". Import `Select` from `@qualcomm-ui/react-vscode/select`. Add a "Control variants" section demonstrating `<Select controlProps={{variant: "ghost"}} collection={collection} />` using the variants formerly shown in `dropdown-input-variants-demo.tsx`.

Update `components+/select+/demos/index.ts`:

```ts
export * from "./select-showcase-demo"
```

- [ ] **Step 10.11: Update `dialog-form-demo.tsx`**

Replace any `import {DropdownInput} from "@qualcomm-ui/react-vscode/dropdown-input"` with appropriate `<Select>` or `<Select.Control>` usage.

- [ ] **Step 10.12: Update all other consumer imports found in Step 10.1**

For each location that imports `DropdownInput` or from `@qualcomm-ui/react-vscode/dropdown-input`, migrate to the Select compound.

- [ ] **Step 10.13: Sweep for missed references**

```bash
grep -rn "Dropdown\|dropdown-input" packages/frameworks/react-vscode/src/ packages/docs/react-vscode-docs/src/
```

Expected: no hits. The Dropdown name is fully retired.

- [ ] **Step 10.14: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
pnpm --filter @qualcomm-ui/react-vscode-docs build
git add -A
git commit -s -m "refactor(select): rebuild on react-core/select; absorb dropdown-input"
```

---

## Task 11: text-input — rename from input, rebuild on CoreTextInput

**Files:**
- Rename dir: `src/input/` → `src/text-input/`
- Delete: `text-input/input.tsx`, `text-input/input-group.tsx` (after rename)
- Rename: `vs-input.css` → `vs-text-input.css`, prefix classes `vs-input*` → `vs-text-input*`
- Create: `text-input-root.tsx`, `text-input-input.tsx`, `text-input-input-group.tsx`, `text-input-label.tsx`, `text-input-hint.tsx`, `text-input-error-text.tsx`, `text-input-error-indicator.tsx`, `text-input-clear-trigger.tsx`, `text-input.tsx` (Simple), `index.ts`

**QDS ref:** `packages/frameworks/react/src/text-input/`.

- [ ] **Step 11.1: Sweep for consumer imports**

```bash
grep -rn "@qualcomm-ui/react-vscode/input\|from \"@qualcomm-ui/react-vscode\"[^\"]*Input" packages/
```

- [ ] **Step 11.2: Rename directory + CSS file**

```bash
git mv packages/frameworks/react-vscode/src/input packages/frameworks/react-vscode/src/text-input
git mv packages/frameworks/react-vscode/src/text-input/vs-input.css packages/frameworks/react-vscode/src/text-input/vs-text-input.css
```

- [ ] **Step 11.3: Delete old non-compound files**

```bash
git rm packages/frameworks/react-vscode/src/text-input/input.tsx
git rm packages/frameworks/react-vscode/src/text-input/input-group.tsx
```

- [ ] **Step 11.4: Rename CSS classes**

In `vs-text-input.css`, find-and-replace `.vs-input` → `.vs-text-input` (and `.vs-input-group` → `.vs-text-input__input-group` matching QDS BEM convention).

- [ ] **Step 11.5: Create compound parts**

For each of `text-input-root.tsx`, `text-input-input.tsx`, `text-input-input-group.tsx`, `text-input-label.tsx`, `text-input-hint.tsx`, `text-input-error-text.tsx`, `text-input-error-indicator.tsx`, `text-input-clear-trigger.tsx` — mirror the QDS peer through the Adaptation Recipe. Apply `vs-text-input__<part>` classes.

- [ ] **Step 11.6: Create Simple `text-input.tsx`**

Mirror `packages/frameworks/react/src/text-input/text-input.tsx`. Signature accepts `label`, `hint`, `errorText`, `invalid`, `placeholder`, `value`, `onValueChange`, plus `*Props` variants. Assembles the compound tree.

- [ ] **Step 11.7: Create `index.ts`**

Mirror QDS structure. Namespace `TextInput` + simple function + individual exports. **Do not re-export legacy `Input` / `InputGroup` names — subpath changes to `/text-input`; consumer imports must update.**

- [ ] **Step 11.8: Update package.json subpath exports**

Check `packages/frameworks/react-vscode/package.json` `"exports"` field. The current wildcard `"./*": {...}` already accommodates `/text-input`. If there's a specific `/input` entry, remove or replace it.

- [ ] **Step 11.9: Update all consumer imports from Step 11.1**

For each location importing `@qualcomm-ui/react-vscode/input`:
- Change path to `@qualcomm-ui/react-vscode/text-input`.
- Switch from `<Input>` / `<InputGroup>` to `<TextInput>` simple API or explicit compound parts.

- [ ] **Step 11.10: Update docs**

The current docs site has no `_input.mdx` page (that was out-of-scope per the spec), so no doc migration needed. Verify:

```bash
ls packages/docs/react-vscode-docs/src/routes/components+/ | grep -iE "^input|text-input"
```
Expected: nothing. If a page exists, rename accordingly.

- [ ] **Step 11.11: Verify + commit**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode build
pnpm --filter @qualcomm-ui/react-vscode-docs build
grep -rn "@qualcomm-ui/react-vscode/input\b" packages/ --include="*.ts" --include="*.tsx" --include="*.mdx"
# Expected: no hits
git add -A
git commit -s -m "refactor(text-input): rename from input; rebuild on CoreTextInput compound"
```

---

## Final verification

- [ ] **Step F.1: Clean full build**

```bash
pnpm --filter @qualcomm-ui/react-vscode build
pnpm --filter @qualcomm-ui/react-vscode-docs build
```
Both must succeed from a fresh `dist/`.

- [ ] **Step F.2: Lint across the whole package**

```bash
pnpm --filter @qualcomm-ui/react-vscode lint
pnpm --filter @qualcomm-ui/react-vscode-docs lint
```

- [ ] **Step F.3: Sweep for retired names**

```bash
grep -rn "OverlayPanel\|DropdownInput\|\bDropdown\b\|@qualcomm-ui/react-vscode/overlay-panel\|@qualcomm-ui/react-vscode/dropdown\|@qualcomm-ui/react-vscode/input\b" packages/frameworks/react-vscode packages/docs/react-vscode-docs
```
Expected: no hits.

- [ ] **Step F.4: Docs site visual sweep**

```bash
pnpm --filter @qualcomm-ui/react-vscode-docs dev
```

Open each route and confirm no regression:
- `/components/badge`, `/button`, `/catalog-card`, `/checkbox` (new hint/error-text), `/dialog`, `/disclosure`, `/field`, `/icon`, `/icon-button`, `/keybinding`, `/menu` (new parts), `/popover` (new page), `/progress`, `/progress-circle`, `/select` (formerly dropdown), `/status`, `/steps` (new parts), `/table`, `/tabs` (new parts), `/text-input` (if page exists), `/tooltip` (new parts)
- Removed: `/overlay-panel`, `/dropdown`, `/dropdown-input`

- [ ] **Step F.5: Final commit push (if everything green)**

```bash
git log --oneline main..HEAD
```

Expected: 11 commits, one per component, module-scoped titles. If branch is ready for review:

```bash
git push -u origin feature/migrate-react-vscode-library
```

(Only push after explicit user confirmation.)

---

## Open items carried forward from spec

These are noted for awareness during execution — each task above assumes the default resolution. Escalate to the user if a non-default outcome seems warranted:

- `vs-text-input.css` vs `vs-input.css`: default **rename** to `vs-text-input.css`.
- `progress-circle-context.ts`: default **keep the existing local ring-sizing context** unless it conflicts with `CoreProgressRing.Context`.
- `vs-dropdown` → `vs-select` class rename: default **rename** to match the component rename.
- Tabs namespace split (`Tabs.*` vs `Tab.*`): default **split into two namespaces** per QDS convention.
- `SelectValueText` vs inline value on `SelectControl`: default **expose `SelectValueText` as a separate part** and have the Simple API compose it inside `<SelectControl>`.
