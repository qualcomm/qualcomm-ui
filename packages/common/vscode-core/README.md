# @qualcomm-ui/vscode-core

Framework-independent VS Code presentation definitions, parallel to `qds-core`. Shared interaction behavior stays in `core`; React bindings stay in `react-core` and `react-vscode`.

## Typography and host styles

Import `@qualcomm-ui/vscode-core/styles/components.css` and add `qui-vscode` to the application container. The stylesheet includes host-backed tokens, base typography, and CSS typography classes. It has no React, Tailwind, or QDS dependency.

```css
@import "@qualcomm-ui/vscode-core/styles/components.css";
```

```html
<main class="qui-vscode">
  <h1 class="qui-vscode-heading-1">Build configuration</h1>
  <p class="qui-vscode-body-1 qui-vscode-text-muted">Choose an output directory.</p>
</main>
```

`src/tokens/tokens.ts` owns the typography scale and host mappings. It exports metadata at `@qualcomm-ui/vscode-core/tokens`. Generated `src/styles/tokens.css` defines `--qui-vscode-*` values within `qui-vscode`; generated typography classes consume those values. Host UI size scales legacy proportions, while code uses the host editor font settings. Status-text mappings and small legacy roles still require design and contrast review before release.

`styles/tokens.css` exports only token declarations for integrations that supply their own styles. The optional Tailwind adapter lives at `@qualcomm-ui/tailwind-plugin/vscode.css`; it reads these tokens rather than owning another scale.

## Build and update

From the repository root:

```shell
pnpm vscode-core build
pnpm tailwind-plugin generate-css:vscode
pnpm tailwind-plugin build:css
pnpm react-vscode build
```

After changing `src/tokens/tokens.ts`, run `pnpm vscode-core build`, then regenerate the Tailwind adapter. Both generated CSS files are checked in; edit their source definitions rather than editing generated files. Shared CSS changes can use `pnpm vscode-core watch:css`.

## Package boundaries

VS Code tokens, shared host styles, typography, and opacity bindings belong in this package. Component behavior belongs in `core` and the framework core packages. React rendering, component-specific CSS, and appearance types belong beside their implementations in `react-vscode`.

Keep framework imports, QDS tokens, Node.js runtime APIs, and VS Code extension APIs outside this package. Browser bindings may use DOM APIs when called; importing them must remain safe outside the browser. Tailwind consumes this package for generation, so dependencies on React packages or test utilities would recreate the workspace build cycle.

Saved preview theme metadata and CSS fixtures live in `react-vscode-docs/src/themes` and do not ship with the libraries.

## Host utility metadata

`hostColorTokens`, `hostShadowTokens`, and `hostOpacityTokens` are exported from `@qualcomm-ui/vscode-core/tokens`. The optional Tailwind adapter generates its palette from these mappings. Component wrappers can consume the same host variables without Tailwind.

Shadow tokens combine host colors with `--qui-vscode-shadow-geometry` (`0 2px 8px` by default). Host shadow values are colors, not complete shadows. Missing named shadow colors fall back to transparent.

`bindVscodeOpacity` from `@qualcomm-ui/vscode-core/opacity` is an optional browser binding. Call it once for a container; it converts host color alpha to numeric `--qui-vscode-opacity-editor-unnecessary-code` and `--qui-vscode-opacity-minimap-foreground` values. It watches container and ancestor theme attributes. Its cleanup disconnects observation and restores previous inline values. Unused-code opacity remains 1 in high-contrast themes. Missing or invalid colors also resolve to 1; the conversion uses a browser canvas and needs a 2D context. Importing the module does not access browser globals.
