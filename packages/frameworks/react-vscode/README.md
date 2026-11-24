# @qualcomm-ui/react-vscode

Build React interfaces for VS Code webviews using QUI's design-agnostic `core` and `react-core` behavior and host theme tokens.

The package currently provides a stylesheet containing the shared host styles and typography variables. Import token metadata and opacity bindings directly from `vscode-core`. Component APIs remain to be implemented. Typography preserves the legacy scale proportions while following the host UI font size; design and contrast review remain required before release.

## Build the package

From the repository root, install workspace dependencies and build the package:

```shell
pnpm install
pnpm vscode-core build
pnpm react-vscode build
```

The build emits ESM entrypoints, declarations, and `dist/styles.css`.

## Load host styles

Import `@qualcomm-ui/react-vscode/styles.css` and apply the `qui-vscode` class to the application container. VS Code supplies the font and color variables inside a webview. Browser previews must supply their own fixture values.

The stylesheet does not download fonts or load QDS brand styles. Code typography uses `--vscode-editor-font-family`, with editor size and weight where appropriate.

## Add a component

Use a top-level `src/<component>/` folder with an `index.ts` entrypoint, React implementations, appearance types, component CSS, and behavior tests. Vite discovers these entrypoints automatically. Import component CSS from its entrypoint so Vite includes it in the public stylesheet. Keep CSS and framework-independent appearance definitions separate from React props, hooks, and rendering so they can be extracted later.

Shared behavior belongs in `@qualcomm-ui/core` or `@qualcomm-ui/react-core`. VS Code tokens, shared styles, and opacity bindings belong in `@qualcomm-ui/vscode-core`. Component-specific styles and appearance types belong beside their React implementations. Do not import QDS components or styling APIs.

Component documentation belongs in `packages/docs/react-vscode-docs`. Follow the priority order and acceptance requirements in [REACT-VSCODE-PLAN.md](../../../../REACT-VSCODE-PLAN.md).

## Use the shared VS Code foundation

`vscode-core` contains framework-independent TypeScript and CSS under `tokens`, `styles`, and `opacity`. Keep React, QDS, Node.js runtime APIs, and extension-host APIs outside that package. Browser bindings may use DOM APIs when called; importing them must remain safe outside the browser.

Import token metadata from `@qualcomm-ui/vscode-core/tokens` and `bindVscodeOpacity` from `@qualcomm-ui/vscode-core/opacity`. These entrypoints have no React imports, CSS side effects, or DOM access during import. Edit `vscode-core/src/tokens/tokens.ts`, then build `vscode-core`, rebuild the React library, and regenerate the Tailwind adapter. Do not edit generated CSS directly.

If another framework is requested, reuse `vscode-core` and that framework's behavior primitives. Move reusable component CSS and framework-independent appearance definitions into the foundation as needed. Keep React component contracts in this package. Saved preview themes live only in `react-vscode-docs/src/themes`.

## Apply typography

Apply `--font-static-heading-xxl` or `--font-static-body-md-default` through the CSS `font` property for titles or body text. The optional Tailwind adapter provides equivalent utilities such as `font-body-md`. Text inherits the container color. For other text colors, use CSS variables such as `--color-text-muted` or optional Tailwind utilities such as `text-muted`. Keep semantic HTML and verify status-text contrast in the consuming host theme. The CSS works without Tailwind.
