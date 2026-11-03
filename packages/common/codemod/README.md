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

| Codemod              | Versions                                  | Description                                                                                                                                                                        |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `not-found-route`    | `@qualcomm-ui/react-router-utils` v2 → v3 | Adds the `NotFound` component to the fallback route (`$.tsx`) that uses `createFallbackRouteLoader`                                                                                |
| `docs-context-names` | `@qualcomm-ui/react-mdx` v3               | Renames the deprecated docs context exports to their replacements and moves the page context imports from `@qualcomm-ui/react-mdx/docs-layout` to `@qualcomm-ui/react-mdx/context` |

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
