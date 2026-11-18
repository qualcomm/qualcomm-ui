# React VS Code Documentation

Develop documentation for the NextGen `@qualcomm-ui/react-vscode` package using the existing QUI Docs MDX pipeline and React Router.

## Run the scaffold

From the repository root, run `pnpm install`, `pnpm vscode-core build`, `pnpm react-vscode build`, `pnpm tailwind-plugin generate-css:vscode`, `pnpm tailwind-plugin build:css`, and `pnpm react-vscode-docs dev`. Vite defaults to port 3400; `PORT` overrides it. Port 3300 is reserved for the existing `qui-site` server.

Run `pnpm react-vscode-docs build` for generated API data and the production site. Use `pnpm react-vscode-docs typecheck` and `pnpm react-vscode-docs lint-docs` to check authored content.

The site uses the shared QUI Docs layout and QDS styles, including the header, responsive navigation, table of contents, page links, search, and persistent light/dark theme switching. The homepage follows the React and Angular landing-page layout, with Get Started and Browse Components linking to `/installation` and `/components/overview`. Getting Started is a section heading containing Installation and the nested Setup guides. Host-theming and typography requirements pages are included. Embedded demos use the shared source viewer and independent VS Code theme controls. Migration guides remain planned work.

Component previews run inside the docs site on port 3400. There is no separate debug app or preview server. The Webview Setup guide describes integration in a consuming extension; real host checks happen there.

## Add documentation with a component

Use the docs agent and the QUI Docs authoring skill. Add a component page at `src/routes/components+/<component>+/_<component>.mdx` and colocate runnable React demos under `demos/`. Reserved folders do not create public pages until an MDX route is added.

Update `qui-docs.config.ts` for page order and navigation, and add implemented components to `src/components/component-list.ts` for the overview cards. Generated API references come from `qui-typedoc.config.ts` and public library declarations. Include a QDS comparison table on each component page.

The documentation shell uses the same QDS fonts and styles as the React and Angular docs. Saved theme metadata lives in `src/themes/preview-themes.ts`, and scoped fixtures live in `src/themes/preview.css`. Render embedded examples with `VscodeDemo`, which applies `qui-vscode` and fixture variables to each preview container. Those previews inherit host font variables instead of the documentation font. QDS brand tokens must not determine VS Code component appearance. The published library remains independent of QDS packages. Review [REACT-VSCODE-PLAN.md](../../../../REACT-VSCODE-PLAN.md) for delivery priorities and acceptance requirements.

## Presentation boundary

`vscode-core` owns portable VS Code tokens, host styles, typography, and browser bindings. Import token metadata and opacity bindings directly from `vscode-core`. The React library includes foundation CSS in its stylesheet. The docs import `@qualcomm-ui/react-vscode/styles.css` and the optional Tailwind `vscode.css` entry to demonstrate both APIs. React components use `react-core` behavior. Preview fixtures stay in this docs package and do not ship with either library.
