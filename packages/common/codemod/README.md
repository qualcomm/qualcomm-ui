# @qualcomm-ui/codemod

Codemod utilities for automatic QUI package migrations

## How to

Run a migration from your project root (the directory containing `package.json`):

```shell
npx @qualcomm-ui/codemod@latest migrate qui-docs
```

The CLI detects the major version of each package in the migration and runs every codemod for those versions, including on projects that are already upgraded. It then updates `package.json` to the new versions.

With `--force`, every codemod runs regardless of detected versions, including in packages that use migrated code without listing the migrated packages as dependencies. It skips safety checks that cancel the migration. Updates to dependencies in `package.json` remain limited to packages detected at or past a codemod's starting version; `--force` never adds dependencies or bypasses run-record checks for already-migrated files.

| Option            | Description                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `-d, --dir <dir>` | Project root containing `package.json` (default: `.`)                                              |
| `--dry-run`       | Preview changes without writing files                                                              |
| `--force`         | Run every codemod regardless of detected versions and skip safety checks that cancel the migration |

Run the following command to see the available migrations and options:

```shell
npx @qualcomm-ui/codemod@latest migrate --help
```

## Migrations

### qui-docs

Packages: `@qualcomm-ui/mdx-vite`, `@qualcomm-ui/react-mdx`, `@qualcomm-ui/react-router-utils`

| Codemod                     | Versions                                  | Description                                                                                                                                                                            |
| --------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fallback-route`            | `@qualcomm-ui/react-router-utils` v1 → v3 | Creates the fallback route (`$.tsx`) or adds its missing `createFallbackRouteLoader` export                                                                                            |
| `not-found-route`           | `@qualcomm-ui/react-router-utils` v2 → v3 | Adds the `NotFound` component to the fallback route (`$.tsx`) that uses `createFallbackRouteLoader`                                                                                    |
| `fallback-route-middleware` | `@qualcomm-ui/react-router-utils` v3      | Adds `createFallbackRouteMiddleware` to the fallback route (`$.tsx`) with the loader's arguments and extracts inline arguments into a shared `fallbackRouteArgs` constant              |
| `docs-context-names`        | `@qualcomm-ui/react-mdx` v3               | Renames the deprecated docs context exports to their replacements and moves the page context imports from `@qualcomm-ui/react-mdx/docs-layout` to `@qualcomm-ui/react-mdx/context`     |
| `remove-open-web-ui`        | `@qualcomm-ui/mdx-vite` v4                | Removes the `knowledge.integrations` field from `qui-docs.config.*`                                                                                                                    |
| `validate-page-links`       | `@qualcomm-ui/mdx-vite` v4 → v5           | Replaces the removed `validatePageLinks` option with the `lint.brokenLinks` rule: `false` becomes `brokenLinks: "off"` unless `lint.brokenLinks` is already set, and `true` is removed |

`fallback-route` runs first and reads `appDirectory` (default: `app`) and `pageDirectory` (default: `routes`) from each `qui-docs.config.{ts,mts,cts,js,mjs,cjs}` in the project. It targets `<appDirectory>/<pageDirectory>/$.tsx`, resolving `appDirectory` from the project root. Config objects are followed through `satisfies`/`as`, wrapper calls, and same-file variables. The loader reuses the identifier passed to `createFallbackRouteMiddleware` or an existing `fallbackRouteArgs` constant. Otherwise it uses `{exports: siteData.exports, getPages, getSections}`, adding required imports and reusing aliases. The loader goes after the middleware export or, without middleware, after the imports. Manual updates are reported for a different exported loader, such as the legacy loader that throws a 404 response, an unexported `loader` binding, inline middleware arguments, conflicting `getPages`/`getSections`/`siteData` bindings, or config directories that cannot be read statically. Subsequent codemods add the `NotFound` default export and middleware in the same run. In `--dry-run`, a missing file is not created, so those codemods report no matching route and their changes to the new file are not shown. For an existing file, they read the original file without the proposed loader.

`fallback-route-middleware` requires `createFallbackRouteMiddleware` and `FallbackRouteArgs`, added to `@qualcomm-ui/react-router-utils` in the minor release after 3.0.2. The migration does not update `@qualcomm-ui/react-router-utils` in `package.json` for 3.x projects, so projects on 3.0.x must upgrade it before running the codemod, or the new imports will not resolve. This codemod is required for sites with a `NotFound` default export. Without the middleware, React Router renders the loader's `*.md`, `pages.json`, and `sections.json` responses as HTML.

`docs-context-names` targets names added in a later 3.x release of `@qualcomm-ui/react-mdx`. The migration does not update `@qualcomm-ui/react-mdx` in `package.json`, so projects on an earlier 3.x release (such as 3.0.0) must upgrade it before running the codemod, or the new imports will not resolve. The old names remain as deprecated aliases, so this codemod is optional.

| Deprecated                     | Replacement                |
| ------------------------------ | -------------------------- |
| `SiteContextProvider`          | `DocsManifestProvider`     |
| `useSiteContext`               | `useDocsManifestContext`   |
| `SiteDataContextValue`         | `DocsManifestContextValue` |
| `MdxDocsProvider`              | `DocsRuntimeProvider`      |
| `useMdxDocsContext`            | `useDocsRuntimeContext`    |
| `MdxDocsContextValue`          | `DocsRuntimeContextValue`  |
| `MdxDocsLayoutContextProvider` | `DocsPageProvider`         |
| `useMdxDocsLayoutContext`      | `useDocsPageContext`       |
| `MdxDocsLayoutContextState`    | `DocsPageContextValue`     |

The codemod rewrites TS and JS files only, not MDX. It does not reformat edited imports, so run your formatter afterward. It reports the following for manual update instead of rewriting them:

- Namespace imports of the docs-layout entry (`ns.useMdxDocsLayoutContext`)
- Re-exports of the page context from the docs-layout entry

### qds-v2-tokens

Packages: `@qualcomm-ui/qds-core`, `@qualcomm-ui/tailwind-plugin`

> [!WARNING]
> Only run this one-time migration if you know both conditions apply:
>
> - You upgraded from `@qualcomm-ui/qds-core` v1 to v2.
> - You used QDS spacing, sizing, or border radius tokens directly as Tailwind utilities (such as `p-qds-40`) or CSS variables (such as `var(--spacing-40)`, `--border-radius-*`, or `--sizing-*`).
>
> Do not run it on projects that started on v2 or never referenced these tokens directly. Some legacy and new steps share names with different pixel values: legacy `--spacing-100` is 16px, while new `--spacing-100` is 4px. Without a migration record, files using only shared steps are treated as legacy. The codemod can rename tokens that are already correct.

The CLI displays this warning before running. Future QDS codemods will use a separate migration.

| Codemod         | Versions                                                                       | Description                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `qds-v2-tokens` | `@qualcomm-ui/qds-core` v1 → v2 and `@qualcomm-ui/tailwind-plugin` v1 → v2 | Renames legacy `--spacing-*`, `--sizing-*`, and `--border-radius-*` CSS variables, Tailwind spacing utilities, and `--spacing-qds-*` theme variables to steps with the same pixel value |

The codemod runs when either package is detected at v1 or later. Detected v1 dependencies are updated to v2. Tailwind spacing utilities are renamed even when `@qualcomm-ui/tailwind-plugin` isn't listed in `package.json`.

Run the migration:

```shell
npx @qualcomm-ui/codemod@latest migrate qds-v2-tokens
```

Running before or after upgrading the packages produces the same token replacements. Use `--dry-run` to preview changes.

`qds-v2-tokens` renames `p-qds-40` to `p-qds-100`. It preserves variants and negative values (`md:-mt-qds-40` → `md:-mt-qds-100`).

Tailwind border radius utilities and `--radius-*` variables are not changed. The plugin keeps the same names and pixel values, backed by the renamed tokens (`rounded-md` is still 4px). It adds `rounded-2xl` (14px), `rounded-3xl` (16px), `rounded-4xl` (20px), and `rounded-5xl` (24px). This applies to every side and corner variant, including `rounded-t-md`, `rounded-s-md`, and `rounded-ee-md`.

The Tailwind plugin has no sizing utilities. Sizing tokens in arbitrary values (`w-[var(--sizing-70)]` → `w-[var(--sizing-400)]`) are handled by `qds-v2-tokens`.

The codemod scans css, scss, sass, less, pcss, html, ts, tsx, mts, cts, js, jsx, mjs, cjs, vue, svelte, md, and mdx files. It ignores `node_modules`, `dist`, `build`, `coverage`, `.angular`, `.react-router`, and `CHANGELOG.md`. Source-file replacements preserve formatting.

Some legacy steps are valid new steps with different pixel values. The legacy `--spacing-100` is 16px and becomes `--spacing-400`. The new `--spacing-100` is 4px. Each scale is renamed in a single pass, so a token is never renamed twice in one run.

Before writing anything, `qds-v2-tokens` checks every scanned file. If any contains steps found only in v2 (new-only steps), such as `--spacing-25`, `--sizing-900`, or `p-qds-1000`, the entire migration is cancelled, including dry runs. No files are changed. Dependencies and the record in `package.json` are not updated. The CLI exits with code 1. The error lists up to 10 files with their v2-only tokens. It explains the pixel-value differences between shared legacy and v2 steps and suggests `--force`. Files covered by a `qui.completedMigrations` record are checked too. Reruns on migrated projects and monorepo-root runs after a package migration are cancelled when scanned files contain v2-only steps. `--force` skips this check.

After the check passes or is skipped with `--force`, migration detection is per file and scale. Steps found only in the legacy scale are renamed, including in recorded files. Shared steps are renamed in legacy files. A file with new-only steps and no legacy-only steps is treated as migrated, so its shared steps are preserved.

A file that mixes legacy-only, new-only, and shared steps within the same scale is reported for a manual update with suggested replacements. That scale is not rewritten.

With `--force`, a project without a record is treated as migrated by hand when a scale uses new-only steps and no legacy-only steps. Shared steps in that scale are left unchanged. Without a record or new-only steps, files containing only shared steps are treated as legacy.

After renaming tokens, `qds-v2-tokens` adds its name to `qui.completedMigrations`, an array of codemod names in the `package.json` of the directory passed to `-d` (default: the current directory). No record is added if that directory or an ancestor already records the codemod. Entries that aren't strings, and a `completedMigrations` value that isn't an array, are ignored. The `note` field marks the record as managed:

```json
"qui": {
  "note": "Managed by @qualcomm-ui/codemod to track applied migrations. Do not edit or remove.",
  "completedMigrations": ["qds-v2-tokens"]
}
```

On later runs, a file counts as recorded when the `package.json` of its directory or any ancestor directory up to the filesystem root records the codemod. Recorded files keep their shared steps unless they contain legacy-only steps. Running in a monorepo package (`-d packages/app`) and then from the root, or in the reverse order, does not rename the package's migrated tokens again. Such runs require `--force` when scanned files contain v2-only steps.

Commit the `qui` field and do not edit or remove it. Removing it from a project whose files contain only shared steps causes a later run to rename those tokens again.

Token names built at runtime, such as `` `--spacing-${step}` ``, are not rewritten. Bare names without the `--` prefix, such as `"spacing-40"`, are not rewritten.

Spacing step replacements apply to `--spacing-*`, Tailwind spacing utilities, and `--spacing-qds-*`:

| Legacy | New    |
| ------ | ------ |
| `0`    | `0`    |
| `10`   | `25`   |
| `20`   | `50`   |
| `30`   | `75`   |
| `40`   | `100`  |
| `50`   | `150`  |
| `60`   | `175`  |
| `70`   | `200`  |
| `80`   | `250`  |
| `90`   | `300`  |
| `100`  | `400`  |
| `110`  | `500`  |
| `120`  | `600`  |
| `130`  | `700`  |
| `140`  | `800`  |
| `150`  | `900`  |
| `160`  | `1000` |
| `170`  | `1100` |
| `180`  | `1200` |
| `190`  | `1300` |
| `200`  | `1400` |
| `210`  | `1500` |
| `220`  | `1600` |
| `230`  | `1700` |
| `240`  | `1800` |
| `250`  | `1900` |
| `260`  | `2000` |
| `270`  | `2100` |
| `280`  | `2200` |
| `290`  | `2300` |
| `300`  | `2400` |
| `310`  | `2500` |
| `320`  | `3000` |
| `330`  | `3300` |

Sizing step replacements apply to `--sizing-*`:

| Legacy | New    |
| ------ | ------ |
| `10`   | `25`   |
| `20`   | `50`   |
| `30`   | `100`  |
| `40`   | `150`  |
| `50`   | `200`  |
| `60`   | `300`  |
| `70`   | `400`  |
| `80`   | `500`  |
| `90`   | `600`  |
| `100`  | `700`  |
| `110`  | `750`  |
| `120`  | `800`  |
| `125`  | `850`  |
| `130`  | `950`  |
| `140`  | `1000` |
| `150`  | `1150` |
| `160`  | `1200` |
| `170`  | `1400` |
| `180`  | `2000` |
| `190`  | `3000` |
| `200`  | `4000` |

Border radius replacements apply only to `--border-radius-*`:

| Legacy    | New   |
| --------- | ----- |
| `lg`      | `150` |
| `md`      | `100` |
| `none`    | `0`   |
| `rounded` | `max` |
| `sm`      | `75`  |
| `xl`      | `200` |
| `xs`      | `50`  |
| `xxl`     | `300` |

### react

Packages: `@qualcomm-ui/react`

| Codemod          | Versions                     | Description                                                                                                                                            |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `emphasis-props` | `@qualcomm-ui/react` v1 → v2 | Replaces the deprecated `variant` prop of Slider and SegmentedControl with `emphasis`, deprecated `emphasis` values, and deprecated variant type names |

Run the migration:

```shell
npx @qualcomm-ui/codemod@latest migrate react
```

The deprecated props, values, and types remain supported in v2, so run the codemod before or after upgrading. Detected v1 dependencies are updated to v2 in `package.json`. Running it again makes no changes.

`emphasis-props` matches `Slider`, `Slider.Root`, `SegmentedControl.Root`, `Tag`, `Breadcrumbs.Root`, `Progress`, `Progress.Root`, `ProgressRing`, and `ProgressRing.Root` imported from their `@qualcomm-ui/react/<component>` entry points. Aliased and namespace imports are supported. Same-name components from other libraries are ignored.

Prop replacements:

| Components               | Deprecated | Replacement |
| ------------------------ | ---------- | ----------- |
| Slider, SegmentedControl | `variant`  | `emphasis`  |

Value replacements apply to `emphasis` and the deprecated `variant` prop:

| Components                                                    | Deprecated        | Replacement       |
| ------------------------------------------------------------- | ----------------- | ----------------- |
| Slider, SegmentedControl, Breadcrumbs, Progress, ProgressRing | `primary`         | `brand`           |
| Tag                                                           | `outline-brand`   | `brand-outline`   |
| Tag                                                           | `outline-neutral` | `neutral-outline` |
| Tag                                                           | `kiwi`            | `lime`            |

Tag's own `variant` values (`selectable`, `link`, `dismissable`) are unrelated and unchanged.

Type replacements apply to `@qualcomm-ui/qds-core/slider` and `@qualcomm-ui/qds-core/segmented-control`:

| Deprecated                   | Replacement                   |
| ---------------------------- | ----------------------------- |
| `QdsSliderVariant`           | `QdsSliderEmphasis`           |
| `QdsSegmentedControlVariant` | `QdsSegmentedControlEmphasis` |

Type imports, re-exports, and their references are renamed. Aliased imports and re-exports keep their local or exported name. If the replacement name is already imported, the old import keeps its local name (`QdsSliderEmphasis as QdsSliderVariant`).

Values are replaced in string literals, conditional branches (`a ? "primary" : "neutral"`), operands of `??` or `||`, and the right operand of `&&`. Other expressions, such as `variant={value}`, only have the prop renamed. `emphasis` accepts deprecated values, so behavior does not change.

Slider or SegmentedControl elements with both `variant` and `emphasis` are left unchanged and reported for manual update. Remove `variant`; `emphasis` takes precedence at runtime.

Spread props, prop objects or arrays built elsewhere, direct qds-core API usage (`createQdsSliderApi`, `api.variant`), and CSS are not rewritten. Slider and SegmentedControl render `data-emphasis` instead of `data-variant`. Update custom CSS targeting `[data-variant]` on those components manually.

The codemod scans ts, tsx, mts, cts, js, jsx, mjs, and cjs files. It ignores `node_modules`, `dist`, `build`, `coverage`, and `.react-router`. Edits preserve formatting. Edited props are not re-sorted, so run your formatter afterward.

### angular

Packages: `@qualcomm-ui/angular`

| Codemod          | Versions                       | Description                                                                                                                                            |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `emphasis-props` | `@qualcomm-ui/angular` v3 → v4 | Replaces the deprecated `variant` prop of Slider and SegmentedControl with `emphasis`, deprecated `emphasis` values, and deprecated variant type names |

Run the migration:

```shell
npx @qualcomm-ui/codemod@latest migrate angular
```

The deprecated props, values, and types remain supported in v4, so run the codemod before or after upgrading. Detected v3 dependencies are updated to v4 in `package.json`. Running it again makes no changes.

`emphasis-props` matches `<q-slider>`, `[q-slider-root]`, `[q-segmented-control]`, `[q-tag]`, `[q-breadcrumbs-root]`, `[q-progress]`, `[q-progress-root]`, `[q-progress-ring]`, and `[q-progress-ring-root]` selectors.

The codemod rewrites external `.html` templates and inline `template` strings in `@Component` decorators. This includes elements inside `@if` and `@for` blocks, `ng-template`, and structural directives. It handles static attributes (`variant="primary"`), property bindings (`[variant]="'primary'"`, `bind-variant`), and interpolations (`variant="{{ 'primary' }}"`). `[attr.variant]` is unchanged.

Prop replacements:

| Components               | Deprecated | Replacement |
| ------------------------ | ---------- | ----------- |
| Slider, SegmentedControl | `variant`  | `emphasis`  |

Value replacements apply to `emphasis` and the deprecated `variant` prop:

| Components                                                    | Deprecated        | Replacement       |
| ------------------------------------------------------------- | ----------------- | ----------------- |
| Slider, SegmentedControl, Breadcrumbs, Progress, ProgressRing | `primary`         | `brand`           |
| Tag                                                           | `outline-brand`   | `brand-outline`   |
| Tag                                                           | `outline-neutral` | `neutral-outline` |
| Tag                                                           | `kiwi`            | `lime`            |

Tag's own `variant` values (`selectable`, `link`, `dismissable`) are unrelated and unchanged.

Type replacements apply to `@qualcomm-ui/qds-core/slider` and `@qualcomm-ui/qds-core/segmented-control`:

| Deprecated                   | Replacement                   |
| ---------------------------- | ----------------------------- |
| `QdsSliderVariant`           | `QdsSliderEmphasis`           |
| `QdsSegmentedControlVariant` | `QdsSegmentedControlEmphasis` |

Type imports, re-exports, and their references are renamed. Aliased imports and re-exports keep their local or exported name. If the replacement name is already imported, the old import keeps its local name (`QdsSliderEmphasis as QdsSliderVariant`).

Values are replaced in string literals, conditional branches (`a ? 'primary' : 'neutral'`), operands of `??` or `||`, and the right operand of `&&`. Other expressions, such as `[variant]="value"`, only have the prop renamed. `emphasis` accepts deprecated values, so behavior does not change.

It reports the following for manual update instead of rewriting them:

- Inline templates that aren't plain strings, including template literals with `${}` substitutions
- Inline templates containing escape sequences
- Templates that fail to parse
- Slider or SegmentedControl elements with both `variant` and `emphasis`

For elements with both props, remove `variant`; `emphasis` takes precedence at runtime.

Spread props, prop objects or arrays built elsewhere, direct qds-core API usage (`createQdsSliderApi`, `api.variant`), and CSS are not rewritten. Slider and SegmentedControl render `data-emphasis` instead of `data-variant`. Update custom CSS targeting `[data-variant]` on those components manually.

The codemod scans ts, mts, cts, and html files. It ignores `node_modules`, `dist`, `build`, `coverage`, and `.angular`. Edits preserve formatting. Edited props are not re-sorted, so run your formatter afterward.
