# React VS Code Documentation

Develop documentation for the NextGen `@qualcomm-ui/react-vscode` package using the existing QUI Docs MDX pipeline and React Router.

## Run the scaffold

From the repository root, run `pnpm install`, `pnpm vscode-core build`, `pnpm react-vscode build`, `pnpm tailwind-plugin generate-css:vscode`, `pnpm tailwind-plugin build:css`, and `pnpm react-vscode-docs dev`. Vite defaults to port 3400; `PORT` overrides it. Port 3300 is reserved for the existing `qui-site` server.

Run `pnpm react-vscode-docs build` for generated API data and the production site. Use `pnpm react-vscode-docs typecheck` and `pnpm react-vscode-docs lint-docs` to check authored content.

The site uses the shared QUI Docs layout and QDS styles, including the header, responsive navigation, table of contents, page links, search, and persistent light/dark theme switching. The homepage follows the React and Angular landing-page layout, with Get Started and Browse Components linking to `/installation` and `/components/overview`. Getting Started is a section heading containing Installation and the nested Setup guides. Theming contains Overview, Colors, and Typography. Embedded demos use the shared source viewer and independent VS Code theme controls.

Component previews run inside the docs site on port 3400. There is no separate debug app or preview server. Verify real host behavior in a consuming extension.

The public Installation page links to Vite Setup for registry package installation, required peers, and CSS configuration. Vite Setup links to Microsoft's Webview API guide for extension integration. Theming Overview explains the embedded demo theme selector. Workspace installation, library builds, and docs development commands belong in this README. Registry installation remains unavailable until the NextGen VS Code packages are published.

## Add documentation with a component

Use the docs agent and the QUI Docs authoring skill. Add a component page at `src/routes/components+/<component>+/_<component>.mdx` and colocate runnable React demos under `demos/`. Reserved folders do not create public pages until an MDX route is added.

Update `qui-docs.config.ts` for page order and navigation, and add implemented components to `src/components/component-list.ts` for the overview cards. Generated API references come from `qui-typedoc.config.ts` and public library declarations. Include a QDS comparison table on each component page.

The documentation shell uses the same QDS fonts and styles as the React and Angular docs. Saved theme metadata lives in `src/themes/preview-themes.ts`, and scoped fixtures live in `src/themes/preview.css`. Render embedded examples with `VscodeDemo`, which applies `qui-vscode` and fixture variables to each preview container. Those previews inherit host font variables instead of the documentation font. QDS brand tokens must not determine VS Code component appearance. The published library remains independent of QDS packages. Review [REACT-VSCODE-PLAN.md](../../../../REACT-VSCODE-PLAN.md) for delivery priorities and acceptance requirements.

`src/themes/preview-utilities.css` compiles the VS Code adapter separately and scopes its utilities to `.vscode-preview`. It scans routes and demos and references Tailwind's default theme with inline values. The QDS utility scope in `globals.css` ends at preview containers. QDS and VS Code can therefore share names such as `font-body-md` while using their own typography. Import this stylesheet separately from `globals.css`; combining the adapters in one Tailwind compilation would merge their utility definitions.

## Preview theme sources

All 25 colors in each of the ten previews were checked against VS Code source revision `a6a151a3035c25d4e20108f0d4ffddb076734a12` on November 20, 2026. VS Code's theme overrides and registry defaults take precedence over legacy snapshots. Resolve inherited theme files and derived colors when updating these fixtures.

The comparison corrected three legacy values:

| Theme | CSS variable | Legacy snapshot | VS Code |
| --- | --- | --- | --- |
| Dark Modern | `--vscode-button-border` | `rgba(255, 255, 255, 0.07)` | `rgba(255, 255, 255, 0.1)` |
| Dark High Contrast | `--vscode-button-background` | Absent | `#000000` |
| Dark High Contrast | `--vscode-button-hoverBackground` | Absent | `#000000` |

Source references: [built-in themes](https://github.com/microsoft/vscode/tree/a6a151a3035c25d4e20108f0d4ffddb076734a12/extensions), [color defaults](https://github.com/microsoft/vscode/tree/a6a151a3035c25d4e20108f0d4ffddb076734a12/src/vs/platform/theme/common/colors), [editor opacity defaults](https://github.com/microsoft/vscode/blob/a6a151a3035c25d4e20108f0d4ffddb076734a12/src/vs/editor/common/core/editorColorRegistry.ts), [testing colors](https://github.com/microsoft/vscode/blob/a6a151a3035c25d4e20108f0d4ffddb076734a12/src/vs/workbench/contrib/testing/browser/theme.ts), and the [webview theme exporter](https://github.com/microsoft/vscode/blob/a6a151a3035c25d4e20108f0d4ffddb076734a12/src/vs/workbench/contrib/webview/browser/themeing.ts). The exporter supplies only resolved colors. Keep variables unset when VS Code supplies no value.

## Presentation boundary

`vscode-core` owns portable VS Code tokens, host styles, typography, and browser bindings. Import token metadata and opacity bindings directly from `vscode-core`. The React library includes foundation CSS in its stylesheet. The docs import `@qualcomm-ui/react-vscode/styles.css` and the optional Tailwind `vscode.css` entry to demonstrate both APIs. React components use `react-core` behavior. Preview fixtures stay in this docs package and do not ship with either library.
