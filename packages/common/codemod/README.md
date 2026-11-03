# @qualcomm-ui/codemod

Codemod utilities for automatic QUI package migrations

## How to

Run a migration from your project root (the directory containing `package.json`):

```shell
npx @qualcomm-ui/codemod@latest migrate qui-docs
```

The CLI detects the major version of each package in the migration and runs every codemod for those versions, including on projects that are already upgraded. It then updates `package.json` to the new versions.

| Option            | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `-d, --dir <dir>` | Project root containing `package.json` (default: `.`) |
| `--dry-run`       | Preview changes without writing files                 |

Run the following command to see the available migrations and options:

```shell
npx @qualcomm-ui/codemod@latest migrate --help
```

## Migrations

### qui-docs

Packages: `@qualcomm-ui/mdx-vite`, `@qualcomm-ui/react-mdx`, `@qualcomm-ui/react-router-utils`

| Codemod                     | Versions                                  | Description                                                                                                                                                                        |
| --------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fallback-route`            | `@qualcomm-ui/react-router-utils` v2 → v3 | Creates the fallback route (`$.tsx`) or adds its missing `createFallbackRouteLoader` export                                                                                        |
| `not-found-route`           | `@qualcomm-ui/react-router-utils` v2 → v3 | Adds the `NotFound` component to the fallback route (`$.tsx`) that uses `createFallbackRouteLoader`                                                                                |
| `fallback-route-middleware` | `@qualcomm-ui/react-router-utils` v3      | Adds `createFallbackRouteMiddleware` to the fallback route (`$.tsx`) with the loader's arguments and extracts inline arguments into a shared `fallbackRouteArgs` constant          |
| `docs-context-names`        | `@qualcomm-ui/react-mdx` v3               | Renames the deprecated docs context exports to their replacements and moves the page context imports from `@qualcomm-ui/react-mdx/docs-layout` to `@qualcomm-ui/react-mdx/context` |

`fallback-route` runs first and reads `appDirectory` (default: `app`) and `pageDirectory` (default: `routes`) from each `qui-docs.config.{ts,mts,cts,js,mjs,cjs}` in the project. It targets `<appDirectory>/<pageDirectory>/$.tsx`, resolving `appDirectory` from the project root. Config objects are followed through `satisfies`/`as`, wrapper calls, and same-file variables. The loader reuses the identifier passed to `createFallbackRouteMiddleware` or an existing `fallbackRouteArgs` constant. Otherwise it uses `{exports: siteData.exports, getPages, getSections}`, adding required imports and reusing aliases. The loader goes after the middleware export or, without middleware, after the imports. Manual updates are reported for a different exported loader, an unexported `loader` binding, inline middleware arguments, conflicting `getPages`/`getSections`/`siteData` bindings, or config directories that cannot be read statically. Subsequent codemods add the `NotFound` default export and middleware in the same run. In `--dry-run`, a missing file is not created, so those codemods report no matching route and their changes to the new file are not shown. For an existing file, they read the original file without the proposed loader.

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
