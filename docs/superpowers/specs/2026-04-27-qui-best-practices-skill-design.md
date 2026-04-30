# QUI React Best-Practices Skill Family + Audit MCP

**Status:** Design (pre-implementation)
**Date:** 2026-04-27
**Target audience:** External app developers using `@qualcomm-ui/react`

## Amendment 2026-04-29: merge `audit-rules` into `audit-mcp`

The original design split rule matchers (`@qualcomm-ui/audit-rules`) and the
stdio server (`@qualcomm-ui/audit-mcp`) into separate packages. Execution
revisited that decision: the MCP is the only real consumer today, and the
speculative second consumers (parity-check script, dogfood audit) can import
an internal subpath of the MCP package. The split was YAGNI.

**New arrangement:** one package, `@qualcomm-ui/audit-mcp`, contains rule
matchers, `RuleContext`, render-graph builder, stdio server, and the
programmatic `audit` API. Rules are exported from
`@qualcomm-ui/audit-mcp/rules` for the parity-check script and dogfood audit
to import directly. If a real external consumer ever materialises, extract
then.

References below to `@qualcomm-ui/audit-rules` should be read as
`@qualcomm-ui/audit-mcp` (optionally its `/rules` subpath for rule imports).

## Context

External app developers using `@qualcomm-ui/react` routinely reach for the
wrong primitive: a generic `<Button>` inside `<HeaderBar>` instead of
`HeaderBar.ActionButton`, a raw `<a>` inside `<Breadcrumbs.List>` instead of
`Breadcrumbs.Item`, `useState` + `value`/`onChange` when `defaultValue` would
do. The component library already has the right primitives; consumers just
don't discover them.

A cataloguing pass turned up 18 mechanically-detectable violation patterns
across 10 categories (composition, state management, prohibited nesting,
portal constraints, form composition, icons, imperative APIs, deprecated
patterns, accessibility, selection indicators). A handful are runtime-only
and deferred.

This spec covers:

- Three Claude Code skills (`qui-best-practices`, `qui-audit`, `qui-fix`)
  shipped as a plugin.
- A new on-device MCP (`@qualcomm-ui/audit-mcp`) that performs type-aware
  cross-file detection via `ts-morph`.
- New rules added to the existing
  `@qualcomm-ui/eslint-plugin-react` (plugin namespace `@qualcomm-ui/react`,
  at `packages/configs/eslint-plugin-react/`) covering the single-file
  direct-case of each rule for in-editor feedback.
- Two new read-only endpoints on the existing remote `qui-react` MCP serving
  rule *metadata* (title, examples, rationale).

The ESLint plugin and the audit MCP are complementary layers, not
alternatives: ESLint gives sub-second in-editor feedback on ~65% of
violations (the direct-case); the audit MCP plus skills cover wrapped and
spread-prop cases ESLint can't reach and drive the Claude-assisted fix
workflow. Consumers can install one, the other, or both; rule IDs are
shared so messaging is consistent.

Rule *matchers* live as TypeScript code in a new `@qualcomm-ui/audit-rules`
package (ts-morph) with a parallel implementation in
`@qualcomm-ui/eslint-plugin-react` for the direct case.

## Decisions and their rationale

### Type-aware detection (`ts-morph`), not lexical (`ast-grep`)

Original plan was `ast-grep` with rules as YAML in component MDX frontmatter.
Walking through concrete usage showed 8 of 9 seed rules benefit from
cross-file or type-aware analysis. Common wrap patterns that ast-grep can't
see through:

```tsx
// wrapper in another file
export function AppHeader({ children }) {
  return <HeaderBar>{children}</HeaderBar>
}

// violation site in yet another file
<AppHeader><Button>Save</Button></AppHeader>   // ast-grep misses
```

And prop-presence rules (`breadcrumbs-missing-aria-label`, `group-needs-label`)
can't reason about spread props like `<CheckboxGroup {...props} />` without
type info.

The React ecosystem has no standard solution for cross-file component-
composition linting. ESLint rules don't traverse across files. Semgrep
interfile works but is generic and heavy. `ts-morph` gives us the TypeScript
compiler API directly — symbol resolution, type checking, JSX-aware
navigation — and is a straightforward Node dependency.

Accepted cost: rules are TypeScript code, not YAML. They can't live in MDX
frontmatter. They live in a dedicated package instead.

### Cross-file coverage limitations

`ts-morph` resolves what the compiler resolves. Dynamic constructs stay opaque:
- Components returned from higher-order functions whose return types are erased
- Components whose JSX varies by conditional with no type hint
- Spreads of `any`-typed objects

These are accepted misses. The `qui-best-practices` skill primes Claude with
the authoring conventions to minimise Claude-generated violations in the
first place, and the audit reports unresolved nodes explicitly so consumers
can see where type information was unavailable.

### Rule metadata stays centralised; matchers ship with the on-device MCP

Two sources of truth for different things:
- **Remote `qui-react` MCP** owns rule metadata (id, title, category,
  severity, `since`, description, rationale, correct/incorrect examples).
  Surfaced via `list_qui_rules` and `explain_qui_rule`. Authored in
  component MDX frontmatter.
- **On-device `@qualcomm-ui/audit-mcp`** owns rule matchers (code) via its
  dependency on `@qualcomm-ui/audit-rules`.

Reconciled by rule `id`. Rule id is the contract between them.

### Three skills, not one

- `qui-best-practices` — auto-activating priming + post-write self-audit
- `qui-audit` — on-demand, read-only
- `qui-fix` — on-demand, write-allowed, per-item confirmation for warnings

Separation is driven by behaviour: passive vs read-only vs write-allowed.
A single lint skill would conflate the three and make it harder for users
to opt into one mode without the others.

### Retracted claims

Earlier drafts suggested two approaches borrowed from Radix that the Radix
source doesn't actually back up:
- "Type-locking children to a union of valid child types" — Radix uses
  `ReactNode` children like every other React DS. Type-locking JSX children
  is not an idiomatic React pattern and breaks composition.
- "Runtime dev-mode warnings on unexpected children" — Radix's runtime
  warnings are for prop values (empty `altText`, empty `label`), not for
  children composition. Walking `React.Children` to warn on types is ad-hoc,
  not a standard.

These are *not* part of the plan. If QUI wants to adopt either as
independent component-API improvements, that's a separate track.

## Architecture

Four moving pieces:

### 1. Remote `qui-react` HTTP MCP (extend existing)

Location: `/home/rbower/code/qui-http-mcp/packages/mcp-server/`

New read-only tools:

| Tool | Signature | Purpose |
|---|---|---|
| `list_qui_rules` | `({ category?, since? }) → QuiRuleMetadata[]` | Full rule catalogue |
| `explain_qui_rule` | `({ id }) → QuiRuleMetadata & { rationale, migrationNotes }` | Detail for one rule |

Metadata comes from the same MDX pipeline that powers `list_components` and
`search`. New frontmatter block on each component's `.mdx` file.

### 2. On-device `@qualcomm-ui/audit-mcp` (new)

- Transport: stdio
- Distribution: npm (`npx -y @qualcomm-ui/audit-mcp`)
- Runtime: Node ≥22
- Engine: `ts-morph`
- Rule source: `@qualcomm-ui/audit-rules` (sibling package in this
  monorepo, declared as a dependency of the MCP)

Tools:

| Tool | Signature | Purpose |
|---|---|---|
| `audit_qui_usage` | `({ path?, code?, ruleIds? }) → { violations: Violation[], scannedFiles, elapsedMs }` | Run rules against files or inline code |
| `apply_qui_fix` | `({ ruleId, file, line, dryRun? }) → { before, after, applied }` | Apply one rule's codemod |
| `list_available_rules` | `() → { rules, cacheAge }` | Local passthrough for rules filtered to installed version |

Startup sequence:
1. Read consumer `package.json` → find installed `@qualcomm-ui/react` version.
2. Load rules from bundled `@qualcomm-ui/audit-rules`.
3. Filter rules where `rule.since <= installedVersion`.
4. Fetch metadata from remote MCP's `list_qui_rules` (for parity checks and
   rule-level user-facing strings). Cache to `~/.cache/qui-audit/metadata-v{quiVersion}.json`
   with 24h TTL.
5. Build a `ts-morph` `Project` lazily on first audit call (expensive to
   instantiate).

Fallbacks for metadata fetch: disk cache → fields embedded in rule code as
fallback defaults.

### 3. ESLint plugin `@qualcomm-ui/eslint-plugin-react` (extend existing)

Location: `packages/configs/eslint-plugin-react/`. Plugin namespace:
`@qualcomm-ui/react`. Already ships 4 rules at time of writing:

- `accessible-name` — enforces `aria-label` / `aria-labelledby` on a
  `COMPONENTS_REQUIRING_LABEL` list (currently `IconButton`,
  `InlineIconButton`, `HeaderBarActionIconButton`)
- `avatar-image-alt` — requires alt text on `Avatar` images
- `input-label-association` — requires label-input association
- `interactive-card-element-nesting` — forbids interactive elements inside
  `<Card.Root interactive>`. **This is v1 rule #6 already shipped.**

For v1 we:
- **Add 20 new rule files** in `src/rules/`, one `.ts` per rule plus a
  `.spec.ts` per rule in `tests/`. Rule 6
  (`interactive-card-element-nesting`) and rule 18
  (`inline-icon-button-requires-aria-label`, already absorbed by
  `accessible-name`) are the two v1 rules NOT needing new files. Rules 16
  (`dialog-heading-or-aria-labelledby-required`), 17
  (`tooltip-trigger-must-be-interactive`), and 19
  (`link-icon-only-requires-aria-label`) each need their own rule file
  because they check for structural/child conditions rather than simple
  prop presence — they can't be absorbed into `accessible-name`'s
  "components-needing-aria-label" loop.
- Follow the existing pattern established by
  `interactive-card-element-nesting`: import tracking via `isQuiPackage`,
  JSX traversal via `ESLintUtils.RuleCreator`, reuse utility helpers
  (`getJsxElementName`, `hasValidAriaLabel`, `getAttributeValue`).
- **Update `plugin.ts`** to register the new rules in `export const rules`
  and extend the recommended config.

Properties that hold across the v1 additions:

- **Pure AST, no type info, no ts-morph, no typed-linting.** Speed profile
  matches the existing plugin. Runs on every save without visible latency.
- Covers the **direct case** of each v1 rule — the JSX element is literally
  inside the constrained ancestor, the prop is literally present/absent, the
  import is literally from the wrong subpath. Rule visitors walk only the
  current file.
- Does NOT perform cross-file analysis. Wrapped components and spread props
  are not caught here; the audit MCP handles those.
- Rule IDs on the ESLint side match the audit MCP's rule IDs. The ESLint
  plugin namespace differs (`@qualcomm-ui/react/no-button-in-header-bar` in
  ESLint, `no-button-in-header-bar` as the bare `ruleId` in MCP violations).

Direct-case matchers duplicate some of the audit MCP's logic (~20 lines
each). The cost is acceptable; a shared abstraction over ESLint's and
ts-morph's AST APIs is out of scope for v1.

### 4. Skills plugin `@qualcomm-ui/claude-plugin` (new)

Three skill markdown files + plugin manifest. See next section.

## Skills

### `qui-best-practices` (auto-activating)

**Trigger:** activates when Claude reads or edits a file whose imports
include `@qualcomm-ui/react`, or whose project `package.json` declares it.

**Workflow:**
1. Load compact rule summary (~20 lines) into context — high-priority
   composition rules only, not the full catalogue.
2. Claude writes code following those rules on the first pass.
3. After any file write whose import list includes `@qualcomm-ui/react`,
   skill calls `mcp__qui-audit__audit_qui_usage({ path: <edited file> })`.
4. If clean → silent. If violations with auto-fix available → apply silently,
   note what was fixed in the user-facing summary. If violations without
   auto-fix → surface them and ask.

Self-audit scope is the edited file only, not the whole repo.

### `qui-audit` (on-demand, read-only)

**Trigger:** user says "audit", "check QUI usage", or invokes `/qui-audit [path]`.

**Workflow:**
1. Announce scope: "Auditing `<path>`…"
2. Call `mcp__qui-audit__audit_qui_usage({ path })`.
3. Format report grouped by severity × ruleId, each violation with
   `file:line` and a one-line snippet.
4. End with: *"Run `/qui-fix` to apply fixes — N are safe auto-fixes, M are
   judgment calls."*

Never writes files.

### `qui-fix` (on-demand, write-allowed)

Use MCP elicitation in the audit process?

**Trigger:** user says "fix them", "apply fixes", or `/qui-fix [path]`.

**Workflow:**
1. Reuse recent audit results if in context; otherwise run audit.
2. Partition violations:
   - **`autoSafe`**: severity=error + has codemod. Batch per file, show
     unified diff, ask "apply all (N violations across M files)?". On
     confirm, call `apply_qui_fix({ dryRun: false })` for each.
   - **`judgment`**: severity=warning or no codemod. Per-item confirmation.
     Show proposed rewrite + one-line reason ("this `useState` is never
     read outside the Tabs callback — safe to remove?"), ask y/n.
3. Re-run `audit_qui_usage` on affected files. Final report.

## Rule shape

### Code (in `@qualcomm-ui/audit-rules`)

```ts
// packages/tooling/audit-rules/src/rules/no-button-in-toast.ts
import type { QuiAuditRule, RuleContext, Violation } from "../types"

export const rule: QuiAuditRule = {
  id: "no-button-in-toast",
  category: "composition",
  severity: "error",
  since: "1.0.0",

  check(context: RuleContext): Violation[] {
    const violations: Violation[] = []
    const project = context.project  // ts-morph Project

    for (const source of project.getSourceFiles()) {
      for (const jsx of source.getDescendantsOfKind(SyntaxKind.JsxElement)) {
        const tag = jsx.getOpeningElement().getTagNameNode().getText()
        if (tag !== "Button") continue

        if (!context.hasAncestor(jsx, { tag: "Toast.Root", followWrappers: true })) continue

        violations.push(context.violation({
          node: jsx,
          message: "Use Toast.ActionButton inside Toast.Root, not Button.",
          fixable: true,
        }))
      }
    }

    return violations
  },

  fix(violation, context) {
    // Replace <Button …>…</Button> with <Toast.ActionButton …>…</Toast.ActionButton>
    return context.replaceTag(violation.node, "Toast.ActionButton")
  },
}
```

`RuleContext` is the authoring surface. It provides:
- `project: ts-morph.Project` — direct escape hatch
- `hasAncestor(node, { tag, followWrappers })` — transitive ancestry via
  the render graph; `followWrappers: true` resolves user-defined components
  to their JSX root
- `propIsPresent(jsxOpeningElement, propName)` — handles direct props AND
  resolves spread attributes via the type checker
- `violation(partial)` — builder for structured violation objects
- `replaceTag(node, newTag)` — common codemod helper

The render graph (the "does AppHeader transitively render HeaderBar?" map)
is built once per audit run, cached across rules.

### Metadata (in component MDX frontmatter)

```yaml
---
title: Toast
# …existing frontmatter…
qui:
  rules:
    - id: no-button-in-toast
      title: "Use Toast.ActionButton inside Toast.Root"
      category: composition
      severity: error
      since: 1.0.0
      description: >
        Buttons rendered directly inside Toast.Root miss the toast-specific
        density, variant, and click-dismissal wiring.
      rationale: >
        Toast.ActionButton presets variant and density to match the toast
        surface and wires the action to close the toast after invocation.
      examples:
        incorrect: |
          <Toast.Root>
            <Toast.Label>Saved</Toast.Label>
            <Button onClick={undo}>Undo</Button>
          </Toast.Root>
        correct: |
          <Toast.Root>
            <Toast.Label>Saved</Toast.Label>
            <Toast.ActionButton onClick={undo}>Undo</Toast.ActionButton>
          </Toast.Root>
---
```

## Seed rules for v1 (22)

Selected for impact, clear evidence in the source or docs, and clean
mechanical detection.

- The **ESLint** column indicates whether the direct (single-file) case is
  covered by the ESLint plugin. ✅ = new rule to add, 🟢 = already shipped.
- The **MCP+** column indicates whether the audit MCP adds cross-file /
  spread-prop coverage beyond the direct case.
- The **Fix** column indicates the codemod story (`auto` = safe automatic
  rewrite; `partial` = rewrite needs user input; `manual` = no codemod,
  surface only).

### Composition

| # | Rule ID | ESLint | MCP+ | Fix |
|---|---|---|---|---|
| 1 | `no-button-in-header-bar` — `<Button>` inside `<HeaderBar>` → `HeaderBar.ActionButton` | ✅ | wrappers | auto |
| 2 | `no-icon-button-in-header-bar` — `<IconButton>` inside `<HeaderBar>` → `HeaderBar.ActionIconButton` | ✅ | wrappers | auto |
| 3 | `no-button-in-dialog-close` — close-style `<Button>` inside `<Dialog>` → `Dialog.CloseTrigger` | ✅ | wrappers | auto |
| 4 | `no-raw-anchor-in-breadcrumbs` — `<a>` inside `<Breadcrumbs.List>` → `Breadcrumbs.Item` | ✅ | wrappers | auto |
| 5 | `no-button-in-toast` — `<Button>` inside `<Toast.Root>` → `Toast.ActionButton` | ✅ | wrappers | auto |
| 6 | `no-interactive-inside-card-interactive` — interactives inside `<Card.Root interactive>` → forbidden | 🟢 (shipped as `interactive-card-element-nesting`) | wrappers | manual |
| 7 | `no-menu-positioner-in-dialog-portal` — `<Menu.Positioner>` inside `<Dialog.FloatingPortal>` → forbidden | ✅ | wrappers | manual |

### Props / state

| # | Rule ID | ESLint | MCP+ | Fix |
|---|---|---|---|---|
| 8 | `accordion-missing-unique-value` — every `<Accordion.Item>` needs unique `value` | ✅ | wrappers | partial |
| 9 | `select-item-missing-value` — `<Select.Item>` must have `value` | ✅ | wrappers | partial |
| 10 | `segmented-control-item-missing-value` — `<SegmentedControl.Item>` must have `value` | ✅ | wrappers | partial |
| 11 | `radio-group-item-missing-value` — `<RadioGroup.Item>` must have `value` | ✅ | wrappers | partial |
| 12 | `both-value-and-defaultvalue` — don't pass both on the same element | ✅ | — | auto (drop one) |
| 13 | `both-open-and-defaultopen` — don't pass both on the same element | ✅ | — | auto |

### Accessibility

| # | Rule ID | ESLint | MCP+ | Fix |
|---|---|---|---|---|
| 14 | `breadcrumbs-missing-aria-label` — `<Breadcrumbs.List>` without `aria-label` | ✅ | spread | no |
| 15 | `group-needs-label` — `<CheckboxGroup>` / `<SwitchGroup>` without `label` or `aria-label` | ✅ | spread | no |
| 16 | `dialog-heading-or-aria-labelledby-required` — `<Dialog.Content>` needs heading or labelledby | ✅ | wrappers | no |
| 17 | `tooltip-trigger-must-be-interactive` — `<Tooltip.Trigger>` child must be interactive | ✅ | wrappers | no |
| 18 | `inline-icon-button-requires-aria-label` — icon-only `<InlineIconButton>` needs `aria-label` | 🟢 (already in `accessible-name`) | spread | no |
| 19 | `link-icon-only-requires-aria-label` — icon-only `<Link>` needs `aria-label` | ✅ | spread | no |

### Deprecated

| # | Rule ID | ESLint | MCP+ | Fix |
|---|---|---|---|---|
| 20 | `deprecated-qui-root` — `<QuiRoot>` wrapper is no-op, remove it | ✅ | — | auto |
| 21 | `qds-theme-isqdbrand-migration` — replace `QdsThemeContext` hook with `isQdsBrand()` | ✅ | — | auto |

### Imports

| # | Rule ID | ESLint | MCP+ | Fix |
|---|---|---|---|---|
| 22 | `import-subpath-internal` — don't import from `@qualcomm-ui/react-core/*` or `@qualcomm-ui/qds-core/*` | ✅ | — | manual |

### Post-v1 catalogue

Candidates identified during discovery but not in v1. Ship after v1 stabilises:

- **Labelling rules:** `tabs-list-missing-aria-label`, `side-nav-missing-label`,
  `tree-label`, `drawer-heading-required`, `popover-missing-accessible-heading`,
  `progress-accessible-label`, `menu-trigger-text-content`,
  `combobox-missing-aria-label-or-label`
- **Stylistic:** `button-icon-use-icon-props`, `inline-style-override`
- **Needs further validation:** `text-input-no-bare-label` (false-positive
  risk), `tag-multiple-mode-value`, `pagination-page-pagecount-required`
- **Arithmetic checks:** `slider-min-max-step-consistency`,
  `number-input-min-max-consistency` (low audit value)

### Deferred entirely

Out of scope for ts-morph detection:

- **Runtime timing:** `single-toaster-instance`, `uninitialised-toaster-usage`
- **App-entry semantic:** `missing-qds-theme-provider`
- **Semantic forwarding:** `combobox-virtual-data-attrs`

### Rejected

- `duplicate-ids` — not QUI-specific; covered by `eslint-plugin-jsx-a11y`.
- `raw-svg-inside-qui-component` — too broad; high false-positive rate.

## Distribution

Consumer install (one-time):

```json
// .claude/settings.json
{
  "mcpServers": {
    "qui-react": { "type": "http", "url": "https://qui-mcp.qualcomm.com" },
    "qui-audit": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@qualcomm-ui/audit-mcp"]
    }
  }
}
```

Skills plugin: `/plugin install @qualcomm-ui/claude-plugin` (or whichever
channel is canonical for Qualcomm-published plugins).

ESLint plugin (optional, independent of MCP setup):

```bash
pnpm add -D @qualcomm-ui/eslint-plugin-react
```

```js
// eslint.config.js
import quiReact from "@qualcomm-ui/eslint-plugin-react"

export default [
  quiReact.configs.recommended,  // enables all shipped v1 rules
  // ...
]
```

Consumers already using `@qualcomm-ui/eslint-config-react` will pick up the
new rules automatically when the config re-exports the recommended plugin
config.

New docs page covering the full setup under
`packages/docs/react-docs/src/routes/`.

## Critical files

**Existing — modify:**
- `/home/rbower/code/qui-http-mcp/packages/mcp-server/src/modules/` — add
  rules module that ingests MDX `qui.rules:` frontmatter and exposes
  `list_qui_rules` / `explain_qui_rule`.
- `/home/rbower/code/qui-http-mcp/packages/mcp-server/src/server.ts` —
  register new tools.
- `packages/configs/eslint-plugin-react/src/rules/` — add 20 new rule
  files for the direct-case v1 rules (one `.ts` per rule, one `.spec.ts`
  per rule in `tests/`). Only rules 6 (`interactive-card-element-nesting`)
  and 18 (`inline-icon-button-requires-aria-label`, already handled by
  `accessible-name`) are skipped. No changes to existing rule files.
- `packages/configs/eslint-plugin-react/src/plugin.ts` — register new
  rules in the `rules` map and recommended config.
- `packages/configs/eslint-config-react/` — if applicable, wire the plugin
  into the shared config so downstream consumers pick up rules automatically.
- `packages/docs/react-docs/src/routes/components+/<component>+/_<component>.mdx`
  — add `qui.rules:` frontmatter for each seed rule's owning component (up
  to 22 files; co-locate with the relevant component).

**New packages in this monorepo:**
- `packages/tooling/audit-rules/` — `@qualcomm-ui/audit-rules`. ts-morph-based
  rule modules, `RuleContext` API, render-graph builder, shared helpers.
- `packages/tooling/audit-mcp/` — `@qualcomm-ui/audit-mcp`. Stdio server,
  ts-morph integration, consumer version detection, HTTP metadata fetch with
  cache.
- `packages/tooling/claude-plugin/` — `@qualcomm-ui/claude-plugin`. Skill
  markdown files + plugin manifest.

**Reused — do not reinvent:**
- MDX ingestion in qui-http-mcp already parses frontmatter for
  `list_components`. Extend that reader.
- `check_qui_versions` logic in qui-http-mcp reads installed versions from
  consumer `package.json`. The audit MCP's version-filter can reuse the
  same approach (or call into the remote MCP).
- ESLint plugin utilities in `packages/configs/eslint-plugin-react/src/rules/utils.ts`:
  `isQuiPackage` (import detection), `getJsxElementName` (JSX name parsing
  including `Card.Root` and namespace imports), `hasValidAriaLabel`,
  `getAttributeValue`. Every new ESLint rule should use these rather than
  reimplementing.
- Rule-authoring pattern established by
  `packages/configs/eslint-plugin-react/src/rules/interactive-card-element-nesting.ts`
  — import tracking, JSX visitor, reporting. Use it as the template for new
  rules.

## Testing and automation

The detection surface is deterministic (AST + TypeScript program). Tests are
fixture-driven: same input, same output, no LLM in the test loop. All tests
run in CI; failures block merge.

### 1. Per-rule unit tests — ESLint plugin

Use the existing pattern in `packages/configs/eslint-plugin-react/tests/`
(`@typescript-eslint/rule-tester` + vitest). Every new rule file gets a
matching `.spec.ts` with:

- Minimum 3 `valid` cases: canonical correct use, edge variants, and at least
  one case that *looks* like it should fire but doesn't (to pin the rule's
  negative space).
- Minimum 3 `invalid` cases per error path: canonical violation, aliased
  import, and namespace import.
- Autofix assertions where the rule has an `auto` fix in the rules table —
  use RuleTester's `output` field to snapshot the fixed code.
- Message-id assertions (never match on message text, which will drift).

Coverage target: 100% statement coverage on `src/rules/*.ts`. Enforced in CI
via the existing vitest coverage config.

### 2. Per-rule unit tests — audit-rules package (ts-morph)

New in this package. Testing harness exposes a helper that builds a
`ts-morph` `Project` from in-memory or on-disk fixtures and runs a single
rule against it:

```ts
// packages/tooling/audit-rules/tests/helpers/run-rule.ts
import { Project } from "ts-morph"
import type { QuiAuditRule } from "../../src/types"

export function runRule(
  rule: QuiAuditRule,
  files: Record<string, string>,   // path → contents
  options?: { installedQuiVersion?: string },
) {
  const project = new Project({ useInMemoryFileSystem: true, ... })
  for (const [path, source] of Object.entries(files)) {
    project.createSourceFile(path, source)
  }
  const context = buildRuleContext(project, options)
  return rule.check(context)
}
```

Each rule ships with three fixture classes:

**(a) Direct-case fixtures.** Single-file positive and negative. Same
coverage as the ESLint plugin but against the ts-morph harness.
Parity enforced in CI (see section 6).

**(b) Cross-file fixtures.** Multi-file. Wrappers in one file, violations in
another. Asserts the render graph resolves correctly.

```ts
// tests/rules/no-button-in-header-bar.spec.ts
it("flags Button inside wrapped HeaderBar", () => {
  const violations = runRule(rule, {
    "components/app-header.tsx": `
      import { HeaderBar } from "@qualcomm-ui/react/header-bar"
      export function AppHeader({ children }) {
        return <HeaderBar>{children}</HeaderBar>
      }
    `,
    "pages/dashboard.tsx": `
      import { AppHeader } from "../components/app-header"
      import { Button } from "@qualcomm-ui/react/button"
      export const Dashboard = () => (
        <AppHeader><Button>Save</Button></AppHeader>
      )
    `,
  })
  expect(violations).toHaveLength(1)
  expect(violations[0].file).toBe("pages/dashboard.tsx")
  expect(violations[0].ruleId).toBe("no-button-in-header-bar")
})
```

**(c) Spread-prop fixtures** for prop-presence rules. Wrapper with a typed
`Props` interface that forwards `{...props}`. Assert the rule resolves the
spread's type and does / does not fire based on whether the resolved type
includes the required prop.

```ts
it("does not flag when label arrives via typed spread", () => {
  const violations = runRule(rule, {
    "components/pref-group.tsx": `
      import { CheckboxGroup, type CheckboxGroupProps } from "@qualcomm-ui/react/checkbox-group"
      export const PrefGroup = (props: CheckboxGroupProps) => (
        <CheckboxGroup {...props} />
      )
    `,
    "pages/settings.tsx": `
      import { PrefGroup } from "../components/pref-group"
      export const Settings = () => <PrefGroup label="Preferences" />
    `,
  })
  expect(violations).toHaveLength(0)
})
```

**(d) Codemod fixtures** for rules whose table entry says `auto` or
`partial`. Each has a `before.tsx` and `after.tsx`. Test runs
`rule.check()` then `rule.fix()` and asserts the resulting source equals
`after.tsx` character-for-character. Snapshot updates gated by an
explicit `UPDATE_SNAPSHOTS=1` env var.

### 3. Render-graph unit tests

Separate from rule tests — exercises the render-graph builder directly.
Given a set of source files, assert the expected edges:

```ts
it("records AppHeader → HeaderBar", () => {
  const graph = buildRenderGraph(projectWith({
    "app-header.tsx": `...`,
  }))
  expect(graph.resolvesTo("AppHeader", "HeaderBar")).toBe(true)
})
```

Covers: direct-wrap, multi-level wrap, conditional/fragment roots (asserts
"cannot resolve" rather than false-positive), re-exports.

### 4. audit-mcp integration tests

Exercise the stdio server end-to-end using `@modelcontextprotocol/sdk`
client harness.

- **Tool-handler shape**: each tool returns the advertised schema. Contract
  test against the JSON Schema declaration.
- **Version filter**: mock a consumer `package.json` with `@qualcomm-ui/react
  @1.0.0`, insert a rule with `since: 1.19.0`, assert it's filtered from the
  startup rule set.
- **Offline fallback**: mock the remote MCP's `list_qui_rules` to fail
  (network error). Assert startup succeeds using disk cache; missing cache
  falls back to bundled rules-baseline.
- **Metadata cache TTL**: fast-forward time past 24h, assert next startup
  re-fetches from remote.
- **File-walk boundaries**: audit called with `{ path: "src/" }` against a
  fixture project that has both `.tsx` files and irrelevant files
  (`.css`, `.md`); assert only `.tsx` is scanned and unrelated files don't
  appear in `scannedFiles`.

### 5. Remote MCP tests

Add to the existing qui-http-mcp test suite (vitest).

- **MDX frontmatter ingestion**: given a fixture `.mdx` with `qui.rules:`
  block, ingest returns the expected rule-metadata objects.
- **Tool handlers**: `list_qui_rules({ category: "accessibility" })`
  filters correctly; `explain_qui_rule({ id: "…" })` returns full payload;
  unknown id returns a structured error, not a 500.
- **Rule-id uniqueness**: ingestion fails if two components declare the
  same rule id.

### 6. Cross-package parity check (CI-enforced invariant)

New CI job. Runs on PR. Compares three sources of truth for rule IDs:

| Source | Role |
|---|---|
| `@qualcomm-ui/audit-rules` exports | Ground truth — every rule ships a matcher here |
| `@qualcomm-ui/eslint-plugin-react` registered rules | Must match for every rule marked ESLint-available in the spec |
| MDX frontmatter `qui.rules:` blocks (across `react-docs`) | Must match for every rule, since every rule has user-facing metadata |

Fails the build on any of:
- Rule id in audit-rules missing from MDX frontmatter
- Rule id in audit-rules missing from eslint plugin when the rule declares
  `eslintAvailable: true` in its metadata
- Title / severity / `since` drift between audit-rules declaration and MDX
  frontmatter
- Duplicate rule ids

Implementation: a script in `packages/tooling/audit-rules/scripts/check-parity.ts`
invoked from the root `pnpm check-parity` task, wired into the CI workflow.

### 7. Dogfood audit (CI-enforced invariant)

New CI job. Runs the audit MCP's detection engine against the monorepo's
own code — specifically the debug apps and the React docs demos:

- `packages/debug-apps/react-debug-app/**/*.tsx`
- `packages/docs/react-docs/src/routes/components+/**/demos/*.tsx`

Expected result: zero violations. Any violation fails the build. This
catches two classes of drift:

1. **Rule regressions** — a rule change introduces a false positive against
   known-correct code.
2. **Demo rot** — a new or edited demo introduces a real violation that
   would have shipped as an example for consumers to copy.

Runs via `pnpm audit:dogfood` (new script in the root). Implementation:
programmatic import of the audit-rules package + ts-morph Project pointed at
the monorepo root; no MCP stdio overhead.

### 8. Changeset enforcement for rule changes

Extend the existing changeset policy:

- Any change under `packages/tooling/audit-rules/src/rules/` or
  `packages/configs/eslint-plugin-react/src/rules/` requires a changeset on
  the respective package.
- Any MDX `qui.rules:` frontmatter change requires a changeset on
  `@qualcomm-ui/react-docs` (to bump the docs-site).
- CI check: PR touching rule files without a corresponding changeset is
  blocked.

### 9. Release smoke test (manual — final acceptance per release)

Run before tagging a release. Intentionally manual because it exercises
installation from the npm registry and skill-plugin runtime behaviour that
unit tests can't cover:

1. Fresh scratch project with `@qualcomm-ui/react` installed at the
   to-be-released version.
2. Configure both MCPs + install the claude-plugin per the Distribution
   section.
3. Create `src/Header.tsx` with `<Button>` inside `<HeaderBar>`. In Claude
   Code, ask *"audit this file"*. Expect a `no-button-in-header-bar` error.
4. Ask *"fix it"*. Expect the diff, confirm, verify rewrite to
   `HeaderBar.ActionButton`. Re-audit clean.
5. In a fresh file, ask *"add a header bar with save/cancel actions"*.
   Verify Claude writes `HeaderBar.ActionButton` on the first pass
   (best-practices priming) without an explicit prompt.
6. Install `@qualcomm-ui/eslint-plugin-react` in the same project. Open
   `src/Header.tsx` in VS Code. Verify the in-editor squiggle matches the
   MCP audit's finding.
7. Restart with no network access. Verify the audit MCP still starts and
   serves rules from cache.

## Out of scope for v1

- Cross-file rules that need runtime timing (single-toaster-instance,
  uninitialised-toaster).
- Angular parity. Same architecture ports; file a follow-up once React shape
  is proven in production.
- IDE-native lint integration beyond the ESLint plugin. The ESLint plugin
  provides in-editor feedback via any ESLint integration; no custom LSP.
- Type-locking component children or walking `React.Children` for runtime
  warnings — independent component-API tracks, not audit concerns.
- **AI evaluations / LLM-in-the-loop test harnesses.** Detection is
  deterministic static analysis; tests are fixtures. AI evals belong (if
  anywhere) in the remote MCP repo where Claude-side behaviour is
  evaluated, not in this monorepo.
