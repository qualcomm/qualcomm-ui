# Contribution Guidelines for Cross-Framework Architecture

## Context

The current `qui-docs.config.ts` references 7 contribution guideline pages (overview, getting-started, component-authoring, base-component, react-component, react-documentation, testing-guidelines) — but the route directory doesn't exist yet. The old guidelines (from qui-main) covered a simpler single-framework architecture. The new qualcomm-ui architecture has 4 layers (headless core, framework adapters, design system, styled components) spanning both React and Angular. We need comprehensive guidelines that reflect this.

## Structure: 12 Pages

Replace the `children` array in `qui-docs.config.ts` (lines 88-110) with:

```ts
children: [
  {id: "overview"},
  {id: "getting-started"},
  {id: "architecture"},
  {id: "headless-core"},
  {id: "qds-core"},
  {id: "react-component"},
  {id: "angular-component"},
  {id: "react-documentation"},
  {id: "angular-documentation"},
  {id: "testing-guidelines"},
  {id: "build-system"},
  {id: "code-quality"},
]
```

All files go under: `packages/docs/react-docs/src/routes/contribution-guidelines+/`
File naming: plain names without underscore prefix (matching patterns+ convention).

---

## Page Outlines

### 1. `overview.mdx` — Overview

- What qualcomm-ui is and who this guide is for
- Architecture at a glance (brief 4-layer summary with link to Architecture page)
- Full monorepo package tree using `FileTree` component
- "Pick Your Path" callout: React contributors cannot skip Angular sections, and vice versa, but they can start with one approach and move to the other afterward
- Links to each subsequent page

### 2. `getting-started.mdx` — Getting Started

- Prerequisites (Node.js, pnpm)
- Clone repo, set up upstream remote
- `pnpm i` from root
- Initial build (`pnpm build`), explain turborepo dependency graph
- explain package aliases from root package.json (`pnpm react test`, `pnpm core test`, etc.)
- `pnpm dev:react` to start react in watch mode
- `pnpm dev:angular` to start angular in watch mode
- `pnpm react-docs dev` to start react docs site in watch mode
- explain faster alternative for component debugging: `pnpm react-ssr dev` which runs `packages/debug-apps/react-ssr` in watch mode.
- TypeDoc generation (`pnpm doc-gen`)
- Docs sites (`pnpm react-docs dev`, `pnpm angular-docs dev`)
- Running tests

### 3. `architecture.mdx` — Architecture

The centerpiece page. Covers:
- Philosophy: why this architecture, the zag.js lineage
- The 4-Layer Model with dedicated subsections:
  - Layer 1: Headless Core (utils, dom, core) — state machines, zero framework deps
  - Layer 2: Framework Adapters (react-core, angular-core) — components/hooks/directives wrapping machines
  - Layer 3: Design System (qds-core) — CSS classes, design tokens, QDS APIs
  - Layer 4: Styled Components (react, angular) — merging all layers into consumer components
- Dependency flow diagram: `utils -> dom -> core -> qds-core -> react-core/angular-core -> react/angular`
- Data flow walkthrough: checkbox click from DOM event through machine to rendered output
- File naming convention table (all 6 packages)
- Key abstractions: state machines, bindings pattern, PropNormalizer, mergeProps

### 4. `headless-core.mdx` — Headless Core

- Package overview: utils, dom, core
- utils key modules: machine/, attributes/, merge-props/, object/, guard/
- dom key modules: focus-visible/, floating-ui/, query/
- core — the heart. Full checkbox walkthrough:
  - `checkbox.types.ts` — CheckboxSchema interface
  - `checkbox.machine.ts` — createMachine, actions, effects, computed, bindable context
  - `checkbox.api.ts` — createCheckboxApi, binding getters, data-attribute pattern
  - `checkbox.props.ts` — splitCheckboxProps
  - `internal/` — DOM element selectors
- Step-by-step: creating a new core component (6 steps)
- Conventions: bindable state, NOUN.VERB events, cleanup-returning effects, scope for DOM access

**Reference files:**
- `packages/common/core/src/checkbox/checkbox.machine.ts`
- `packages/common/core/src/checkbox/checkbox.api.ts`
- `packages/common/core/src/checkbox/checkbox.types.ts`
- `packages/common/core/src/checkbox/checkbox.props.ts`

### 5. `qds-core.mdx` — QDS Core

- Purpose: separating design system from behavior
- Checkbox walkthrough:
  - `checkbox.classes.ts` — BEM-like class names (qui-checkbox__root, etc.)
  - `checkbox.types.ts` — QdsCheckboxApiProps, binding interfaces
  - `checkbox.api.ts` — createQdsCheckboxApi, normalize.element()
  - `qds-checkbox.css` — design tokens, data-attribute selectors
- CSS conventions: `qui-[component]__[part]` naming, data-attribute selectors for state, design token usage
- Step-by-step: creating a new QDS component (6 steps)
- Design token reference: point to `packages/common/qds-core/src/styles/qualcomm-dark.css`
  - All themes use the same base design tokens with different values

**Reference files:**
- `packages/common/qds-core/src/checkbox/`

### 6. `react-component.mdx` — React Component

- Two packages: react-core (hooks + context) and react (styled components)
- react-core walkthrough:
  - `use-checkbox.ts` — useMachine + createCheckboxApi
  - `checkbox-context.ts` — CheckboxContextProvider + useCheckboxContext
  - Key utilities: useMachine, normalizeProps, useControlledId, PolymorphicElement, mergeProps
- react (styled) walkthrough:
  - `checkbox-root.tsx` — splitProps, useCheckbox, createQdsCheckboxApi, mergeProps, dual context providers
  - Subcomponents — dual-context consumption
  - `checkbox.tsx` — convenience component assembling parts
  - `qds-checkbox-context.ts` — QDS-specific context
- Step-by-step: creating a new React component
- Key patterns: props splitting, dual context, mergeProps ordering (core -> QDS -> user), PolymorphicElement

**Reference files:**
- `packages/frameworks/react-core/src/checkbox/`
- `packages/frameworks/react/src/checkbox/`

### 7. `angular-component.mdx` — Angular Component

- Two packages: angular-core (directives + services) and angular (styled)
- angular-core walkthrough:
  - `CoreCheckboxRootDirective` — inputs with signals, useMachine, useTrackBindings, ControlValueAccessor
  - `CheckboxContextService` — DI-based context
- angular (styled) walkthrough:
  - `CheckboxRootDirective` — extends core, adds QDS via trackBindings.extendWith()
  - Subcomponents: attribute selectors (q-checkbox-control, etc.)
  - `CheckboxComponent` — convenience component
  - `CheckboxModule` — NgModule declarations/exports
- Step-by-step: creating a new Angular component
- Key patterns: trackBindings, Angular Forms integration, signal-based inputs, NgModule grouping

**Reference files:**
- `packages/frameworks/angular-core/src/checkbox/`
- `packages/frameworks/angular/src/checkbox/`

### 8. `react-documentation.mdx` — React Documentation

- Docs site overview (React Router v7, remix-flat-routes, MDX)
- Page creation: file path convention, frontmatter (title, group, description, component, aliases, badges)
- Demo components: location, naming, barrel exports, `<Demo />` usage
- Available MDX components: Demo, TypeDocProps, TypeDocAttributes, FileTree, NpmInstallTabs, alerts, spoilers, terms
- JSDoc authoring: every prop needs JSDoc, @default tags, @link for cross-refs
- MDX page structure template
- navConfig: adding to qui-docs.config.ts

### 9. `angular-documentation.mdx` — Angular Documentation

- Same framework (React Router v7 + MDX) with Angular demo rendering
- Differences from React docs (Angular component host in React shell)
- Page creation (same flat-routes convention)
- Angular-specific demo patterns
- Translation guidelines (consistent structure, adapted code examples)
- Angular-specific patterns: ngModel examples, Reactive Forms, directive selectors

### 10. `testing-guidelines.mdx` — Testing Guidelines

- Philosophy: test behavior, not implementation (carry forward legacy content)
- Stack: vitest + vitest browser mode (playwright), @testing-library/angular
- React tests:
  - Location: `packages/frameworks/react/src/[component]/[component].spec.tsx`
  - MultiComponentTestCase pattern: { simple(), composite(), testCase(getComponent) }
  - Walk through checkbox spec
- Angular tests:
  - Location: `packages/frameworks/angular/src/[component]/[component].spec.ts`
  - `MultiComponentTest`/`runTests()` pattern
  - Angular-specific: render from `@testing-library/angular`, form testing
- Running tests: pnpm react test, pnpm angular test, pnpm core test
- What to test: state toggling, disabled, controlled state, form integration, validation, all parts rendered

**Reference files:**
- `packages/frameworks/react/src/checkbox/checkbox.spec.tsx`
- `packages/frameworks/angular/src/checkbox/checkbox.spec.ts`

### 11. `build-system.mdx` — Build System

- pnpm workspaces structure
- Turborepo task dependencies and caching
- Build order: utils -> dom -> core -> qds-core -> react-core/angular-core -> react/angular
- Package script aliases
- TypeDoc generation
- Angular ng-packagr specifics
- CI pipeline commands
- Adding a new package

### 12. `code-quality.mdx` — Code Quality

- TypeScript strict mode, named imports, node: prefix
- ESLint configs (react, angular, typescript, mdx)
- Comment guidelines (no redundant comments, keep JSDoc, explain WHY not WHAT)
- PR process (DCO sign-off, branching, Semgrep)
- Formatting (prettier, stylelint)
- Dependency management (prefer built-in, catalog pattern, minimumReleaseAge)

---

## Implementation Approach

1. Update `qui-docs.config.ts` navConfig children array
2. Create all 12 MDX files in `contribution-guidelines+/`
3. Use the `docs` subagent for each page to ensure proper tone and style
4. Code examples should reference real code from the repo (checkbox as the primary example component throughout)
5. Use `FileTree` component (items prop format, not legacy Tree/TreeFolder JSX)
6. Use GitHub-style callouts: `> [!note]`, `> [!tip]`, `> [!warning]`

## Verification

1. Run `pnpm react-docs dev` and navigate to `/contribution-guidelines/overview`
2. Verify all 12 pages render correctly and appear in the sidebar
3. Verify all internal links between pages work
4. Verify FileTree components render properly
5. Verify code blocks have correct syntax highlighting