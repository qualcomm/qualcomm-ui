---
name: sync-demos
description: "Sync documentation demos with debug apps across React and Angular frameworks. Detects new, removed, or renamed demos and updates component pages, barrel exports, routes, and home pages. Use when demos have been added, removed, or renamed in docs, when debug apps are out of sync, or after creating new component documentation."
argument-hint: <react|angular> [component-name]
allowed-tools: Read Edit Write Glob Grep Bash
---

# Sync Demos

Synchronize demos from a documentation site with its corresponding debug app(s). `$ARGUMENTS` specifies the framework (`react` or `angular`) and optionally a component name to scope the sync to a single component.

## Architecture Overview

Each framework's docs package contains the source-of-truth demo components:

- **React**: `packages/docs/react-docs/src/routes/components+/{component}+/demos/{component}-{feature}-demo.tsx`
- **Angular**: `packages/docs/angular-docs/src/routes/components+/{component}+/demos/{component}-{feature}-demo.ts`

Debug apps are thin wrappers that import and render these demos:

- **React**: `packages/debug-apps/react-ssr/src/routes/components+/{component}.tsx`
- **Angular SSR**: `packages/debug-apps/angular-ssr/src/app/components/{component}.ts`
- **Angular CSR**: `packages/debug-apps/angular-csr/src/app/components/{component}.ts`

## Procedure

### Phase 1: Parse arguments

1. Parse `$ARGUMENTS` into `framework` and optional `componentName`.
   - If no framework is provided, stop and ask the user which framework to sync.
   - If a component name is provided, scope all operations to that component only.
   - If no component name is provided, sync all components.

2. Set paths based on framework:
   - **React**:
     - Docs demos: `packages/docs/react-docs/src/routes/components+/`
     - Debug app: `packages/debug-apps/react-ssr/src/routes/components+/`
     - Home page: `packages/debug-apps/react-ssr/src/routes/index.tsx`
   - **Angular**:
     - Docs demos: `packages/docs/angular-docs/src/routes/components+/`
     - Debug apps: `packages/debug-apps/angular-ssr/src/app/components/` AND `packages/debug-apps/angular-csr/src/app/components/`
     - Barrel export: `packages/debug-apps/angular-{ssr,csr}/src/app/components/index.ts`
     - Routes: `packages/debug-apps/angular-{ssr,csr}/src/app/app.routes.ts`
     - Home page: `packages/debug-apps/angular-{ssr,csr}/src/app/home.ts`

### Phase 2: Discover demos

1. Glob for demo files in the docs package:
   - React: `packages/docs/react-docs/src/routes/components+/{component}+/demos/*-demo.tsx`
   - Angular: `packages/docs/angular-docs/src/routes/components+/{component}+/demos/*-demo.ts`

2. Group demos by component. For each component, extract the list of demo slugs (the `{feature}` part from `{component}-{feature}-demo`).

3. Skip components that only have a `.gitkeep` in their demos directory (placeholder components with no demos yet).

### Phase 3: Discover current debug app state

1. For each debug app, read existing component page files.
2. Extract the list of demos currently referenced in each file (by parsing imports).
3. Compare the docs demos with the debug app demos to identify:
   - **New demos**: present in docs but missing from debug app
   - **Removed demos**: present in debug app but missing from docs
   - **New components**: entire component exists in docs but has no debug app page

### Phase 4: Report changes

Before making edits, print a summary of what will change:

```
Sync Summary (react):
  button: +2 demos (loading, icon-only), -1 demo (showcase)
  card: NEW component (3 demos)
  combobox: no changes
```

If there are no changes, print "All debug apps are in sync with docs." and stop.

### Phase 5: Update debug app files

For each component with changes:

#### React (`react-ssr`)

The React debug app page follows this pattern:

```tsx
import {ComponentFeatureDemo as FeatureDemo} from "@qualcomm-ui/react-docs/components+/{component}+/demos/{component}-{feature}-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: FeatureDemo, title: "Feature"},
]

export default function ComponentDemos() {
  return <DemoPageLayout componentName="{component}" demos={demos} />
}
```

Rules:
- Alias imports by stripping the component prefix: `ComponentFeatureDemo as FeatureDemo`.
- Sort the `demos` array alphabetically by title.
- Derive titles from the feature slug by converting kebab-case to Title Case (e.g., `controlled-state` becomes `"Controlled State"`).

#### Angular (`angular-ssr` and `angular-csr`)

The Angular debug app page follows this pattern:

```ts
import {Component} from "@angular/core"

import {ComponentFeatureDemo} from "@qualcomm-ui/angular-docs/components+/{component}+/demos/{component}-{feature}-demo"

@Component({
  imports: [
    ComponentFeatureDemo,
  ],
  selector: "app-{component}",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Feature</h2>
        <div class="demo-container">
          <{component}-{feature}-demo />
        </div>
      </div>
    </div>
  `,
})
export class {PascalComponent}Page {}
```

Rules:
- Only import `ViewEncapsulation` if the existing file already uses it.
- Sort demo imports, the `imports` array, and template sections alphabetically.
- The element tag in the template uses the demo's selector, derived from the filename: `<{component}-{feature}-demo />`.
- Both `angular-ssr` and `angular-csr` get the same file. If `angular-csr` previously had a subset of demos, bring it to parity with the docs.

### Phase 6: Update registrations (Angular only)

For **new components** (not just new demos on existing components):

1. **Barrel export** (`components/index.ts`): Add `export * from "./{component}"` in alphabetical order.

2. **Routes** (`app.routes.ts`): Add the import to the named imports from `"./components"` and add a route entry `{component: {PascalComponent}Page, path: "{component}"}` in alphabetical order.

3. **Home page** (`home.ts`): Add `{name: "{Title Case}", path: "/{component}"}` to the `groups` array in alphabetical order.

### Phase 7: Update registrations (React only)

For **new components**:

1. **Home page** (`routes/index.tsx`): Add `"{component}"` to the `components` array in alphabetical order.

No barrel export or route file changes are needed for React, since it uses file-based routing.

### Phase 8: Validate changes

For each created or modified file, verify:
- Imports resolve to existing demo files (glob the demos directory to confirm)
- No duplicate entries in arrays, routes, or barrel exports
- Alphabetical ordering is consistent across imports, template sections, and registration entries

If validation fails, fix the issue before proceeding.

### Phase 9: Print summary

Print the list of files that were created or modified, grouped by action (created vs. updated).
