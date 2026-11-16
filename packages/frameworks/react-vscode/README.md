# @qualcomm-ui/react-vscode

Build React interfaces for VS Code webviews using QUI's design-agnostic `core` and `react-core` behavior and host theme tokens.

The package currently provides its build configuration and a convenience stylesheet that consumes `vscode-core`. Component folders reserve implementation locations; they do not expose component APIs yet. CSS typography utilities preserve the legacy scale proportions while following the host UI font size. Their names, weights, and text-color mappings are documented in the typography guide; design review remains required before release.

## Build the package

From the repository root, install workspace dependencies and build the package:

```shell
pnpm install
pnpm vscode-core build
pnpm react-vscode build
```

The build emits ESM entrypoints, declarations, and `dist/styles.css`.

## Load host styles

Import `@qualcomm-ui/vscode-core/styles/components.css` and apply the `qui-vscode` class to the application container. VS Code supplies the font and color variables inside a webview. Browser previews must supply their own fixture values.

`@qualcomm-ui/react-vscode/styles.css` remains a convenience bundle of the shared styles. Typography values and CSS belong to `vscode-core`; this package does not define a second scale.

The stylesheet does not download fonts or load QDS brand styles. Code typography uses `--vscode-editor-font-family`, with editor size and weight where appropriate.

## Add a component

Use a top-level `src/<component>/` folder with an `index.ts` entrypoint, colocated React implementations, styles, and behavior tests. Import component CSS from its entrypoint. Vite discovers these entrypoints automatically and combines their styles into `styles.css`.

Shared behavior belongs in `core` or `react-core`. Framework-independent VS Code appearance types, bindings, and CSS belong in `vscode-core`, matching the relationship between QDS `react` and `qds-core`. React composition belongs in this package. Do not import QDS components or styling APIs.

Component documentation belongs in `packages/docs/react-vscode-docs`. Follow the priority order and acceptance requirements in [REACT-VSCODE-PLAN.md](../../../REACT-VSCODE-PLAN.md).

## Apply typography

Use `qui-vscode-heading-1` for page-title presentation, `qui-vscode-body-1` for body text, and `qui-vscode-code` for the editor font. Pair these with `qui-vscode-text-normal`, `qui-vscode-text-muted`, `qui-vscode-text-success`, `qui-vscode-text-warning`, or `qui-vscode-text-error`. Keep semantic HTML and verify status-text contrast in the consuming host theme. The CSS works without Tailwind.
