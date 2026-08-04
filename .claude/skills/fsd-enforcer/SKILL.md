---
name: fsd-enforcer
description: Validate project structure against Feature-Sliced Design rules. Checks layer import restrictions, slice isolation, and segment conventions. Use on a directory or set of changed files to catch FSD violations.
argument-hint: <directory-or-glob>
allowed-tools: Read Glob Grep Bash Agent
---

# FSD Enforcer

Validate that code follows the Feature-Sliced Design conventions defined in the project's `project-structure.mdx`. `$ARGUMENTS` is a directory path, glob pattern, or blank (defaults to `src/`).

## FSD Layer Hierarchy (top to bottom)

| Layer    | Allowed imports                                  |
| -------- | ------------------------------------------------ |
| app      | pages, widgets, features, entities, data, shared |
| pages    | widgets, features, entities, data, shared        |
| widgets  | features, entities, data, shared                 |
| features | entities, data, shared                           |
| entities | data, shared                                     |
| data     | shared                                           |
| shared   | (nothing)                                        |

A module may only import from layers **strictly below** it.

## Rules

### 1. Layer import direction

A file in layer X must not import from any layer at the same level or above X. For example:

- `features/` must NOT import from `widgets/`, `pages/`, or `app/`
- `entities/` must NOT import from `features/`, `widgets/`, `pages/`, or `app/`
- `shared/` must NOT import from any other layer

Scan all `import` and `require` statements. Flag any that reference a path resolving to a higher or same-level layer.

### 2. Slice isolation

Slices within the same layer must not import from each other directly.

- `entities/user/` must NOT import from `entities/product/`
- `features/search/` must NOT import from `features/auth/`

**Exceptions**: The `data` and `shared` layers are exempt from this restriction.

### 3. Public API through barrel files

Cross-slice imports should go through the slice's `index.ts` barrel file, not reach into internal segments directly:

- GOOD: `import { User } from '@/entities/user'`
- BAD: `import { User } from '@/entities/user/model/types'`

Flag imports that bypass the barrel file by reaching into segment subdirectories (`api/`, `model/`, `ui/`, `assets/`).

### 4. Segment conventions

Each slice should use recognized segment names:

- `api/` for external service communication
- `assets/` for media assets
- `model/` for type definitions and business logic
- `ui/` for UI components
- `index.ts` for the public entrypoint

Flag any top-level directories within a slice that don't match these conventions. Report them as warnings (not errors), since projects may have legitimate additions.

### 5. Entity UI purity

UI components in the `entities/` layer should not import API services directly. Entity UI components should receive data through props, not fetch it themselves.

Flag imports from `api/` segments within `entities/*/ui/` files.

## Procedure

### Phase 1: Resolve scope

1. If `$ARGUMENTS` is provided:
   - If it contains `*` or `**`, treat as a glob pattern and resolve to a file list
   - Otherwise treat as a directory path
2. If `$ARGUMENTS` is empty, search for `src/` directories in the project that contain FSD layer folders (`app/`, `pages/`, `features/`, `entities/`, `shared/`, `data/`, `widgets/`). Use the first match.
3. If no FSD structure is found, report this and stop.

### Phase 2: Discover layers and slices

1. Identify which FSD layers exist in the target directory by checking for these top-level folders: `app`, `pages`, `widgets`, `features`, `entities`, `data`, `shared`.
2. For each layer, list its slices (immediate subdirectories).
3. For each slice, list its segments (subdirectories within the slice).

### Phase 3: Check violations

For each source file (`.ts`, `.tsx`, `.js`, `.jsx`) in scope:

1. **Layer import direction** (Rule 1): Parse import paths. Determine the importing file's layer and the target layer. Flag if the target is at the same level or above.
2. **Slice isolation** (Rule 2): If an import crosses from one slice to another within the same layer (excluding `data` and `shared`), flag it.
3. **Barrel file bypass** (Rule 3): If an import from outside a slice reaches into a segment directory (`api/`, `model/`, `ui/`, `assets/`) instead of stopping at the slice root or its `index.ts`, flag it.
4. **Entity UI purity** (Rule 5): If a file under `entities/*/ui/` imports from any `api/` segment, flag it.

After file scanning:

5. **Segment conventions** (Rule 4): For each slice, check that its subdirectories use recognized segment names. Flag unrecognized ones as warnings.

### Phase 4: Report

Print a structured report:

```
FSD Validation Report
=====================
Scope: <directory or pattern>
Layers found: <list>
Slices found: <count>

ERRORS (<count>)
────────────────
[E1] Layer violation: features/auth/model/service.ts imports from widgets/header
     → features/ cannot import from widgets/ (same level or above)

[E2] Slice isolation: entities/user/model/index.ts imports from entities/product
     → slices in the same layer cannot import from each other

[E3] Barrel bypass: pages/dashboard/ui/panel.ts imports from features/auth/model/types
     → should import from features/auth (barrel file)

[E4] Entity UI purity: entities/user/ui/card.tsx imports from entities/user/api/service
     → entity UI should not import API services directly

WARNINGS (<count>)
──────────────────
[W1] Non-standard segment: features/auth/helpers/
     → expected segments: api/, assets/, model/, ui/

No violations found. ✓
```

If there are no violations, confirm the structure passes validation.