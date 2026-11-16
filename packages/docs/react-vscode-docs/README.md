# React VS Code Documentation

Develop documentation for the NextGen `@qualcomm-ui/react-vscode` package using the existing QUI Docs MDX pipeline and React Router.

## Run the scaffold

From the repository root, run `pnpm install`, `pnpm vscode-core build`, `pnpm tailwind-plugin generate-css:vscode`, `pnpm tailwind-plugin build:css`, `pnpm react-vscode build`, and `pnpm react-vscode-docs dev`. Vite defaults to port 3400; `PORT` overrides it. Port 3300 is reserved for the existing `qui-site` server.

Run `pnpm react-vscode-docs build` for generated API data and the production site. Use `pnpm react-vscode-docs typecheck` and `pnpm react-vscode-docs lint-docs` to check authored content.

The site uses the shared QUI Docs layout and QDS styles, including the header, responsive navigation, table of contents, page links, search, and persistent light/dark theme switching. The homepage follows the React and Angular landing-page layout, with Get Started and Browse Components linking to `/installation` and `/components/overview`. Getting Started is a section heading containing Installation and the nested Setup guides. Host-theming and typography requirements pages are included. Embedded demos use the shared source viewer and independent VS Code theme controls. Migration guides remain planned work.

The runnable integration sample lives at `packages/debug-apps/react-vscode-webview`. Build it with `pnpm react-vscode-webview build` after building the library. Consumer previews run inside the docs site on port 3400. The sample’s optional standalone dev server on 3410 is for integration development.

## Add documentation with a component

Use the docs agent and the QUI Docs authoring skill. Add a component page at `src/routes/components+/<component>+/_<component>.mdx` and colocate runnable React demos under `demos/`. Reserved folders do not create public pages until an MDX route is added.

Update `qui-docs.config.ts` for page order and navigation. Generated API references come from `qui-typedoc.config.ts` and public library declarations. Include a QDS comparison table on each component page.

The documentation shell uses the same QDS fonts and styles as the React and Angular docs. Import optional fixtures from `@qualcomm-ui/vscode-core/styles/preview.css` through `src/themes/preview.css`, and render embedded examples with `VscodeDemo`, which applies `qui-vscode` and scoped fixture variables to each preview container. Those previews inherit host font variables instead of the documentation font. QDS brand tokens must not determine VS Code component appearance. The published `react-vscode` library remains independent of QDS packages. Review [REACT-VSCODE-PLAN.md](../../../REACT-VSCODE-PLAN.md) for delivery priorities and acceptance requirements.

## Presentation package boundary

`vscode-core` owns shared VS Code token metadata, host styles, and typography CSS. The docs import its `styles/components.css` entry and the optional Tailwind `vscode.css` entry to demonstrate both public APIs. React components use `react-core` behavior and shared `vscode-core` presentation. The docs and debug app share the optional `vscode-core/preview` metadata and `vscode-core/styles/preview.css` fixtures. Update [REACT-VSCODE-PLAN.md](../../../REACT-VSCODE-PLAN.md) when those responsibilities change.
