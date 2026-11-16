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

After changing `src/tokens/tokens.ts`, run `pnpm vscode-core build`, then regenerate the Tailwind adapter. Both generated CSS files are checked in; edit their source definitions rather than editing generated files. CSS-only component changes can use `pnpm vscode-core watch:css`.

## Add presentation definitions

Use `src/<component>/` for framework-independent appearance types, class names, presentation bindings, and component CSS, following `qds-core` patterns. Name component styles `vscode-<component>.css`; the CSS build configuration includes them in the `styles/components.css` aggregate. React components consume those definitions alongside `react-core` behavior. Do not add framework imports, extension-host API calls, or QDS tokens here.

The React stylesheet entry remains a convenience bundle of these shared styles and any future React-specific CSS. The normal component stylesheet reads values supplied by VS Code. Optional browser preview exports are described in the next section.

## Optional browser previews

Import `vscodePreviewThemes` from `@qualcomm-ui/vscode-core/preview` for the ten legacy theme choices and `@qualcomm-ui/vscode-core/styles/preview.css` for their saved preview colors. Add `vscode-preview` and `data-vscode-preview-theme="light-modern"` to the preview container alongside `qui-vscode`.

```tsx
import {vscodePreviewThemes} from "@qualcomm-ui/vscode-core/preview"
import "@qualcomm-ui/vscode-core/styles/components.css"
import "@qualcomm-ui/vscode-core/styles/preview.css"
```

`src/preview/index.ts` owns the choices; `src/styles/preview.css` owns color snapshots from the legacy docs and browser font fallbacks. The docs and debug app use these optional exports. Preview assets ship in the package but are excluded from `styles/components.css` and the React convenience stylesheet. Runtime applications only load them when explicitly imported.

The snapshots do not track installed editor themes. Optional colors absent from a snapshot use `initial` so the library's fallbacks apply. Keep fixtures scoped to browser previews; real VS Code webviews receive variables from the host and should omit the preview class.

## Host utility metadata

`hostColorTokens`, `hostShadowTokens`, and `hostOpacityTokens` are exported from `@qualcomm-ui/vscode-core/tokens`. The optional Tailwind adapter generates its palette from these mappings. Component wrappers can consume the same host variables without Tailwind.

Shadow tokens combine host colors with `--qui-vscode-shadow-geometry` (`0 2px 8px` by default). Host shadow values are colors, not complete shadows. Missing named shadow colors fall back to transparent.

`bindVscodeOpacity` from `@qualcomm-ui/vscode-core/opacity` is an optional browser binding. Call it once for a container; it converts host color alpha to numeric `--qui-vscode-opacity-editor-unnecessary-code` and `--qui-vscode-opacity-minimap-foreground` values. It watches container and ancestor theme attributes. Its cleanup disconnects observation and restores previous inline values. Unused-code opacity remains 1 in high-contrast themes. Missing or invalid colors also resolve to 1; the conversion uses a browser canvas and needs a 2D context. Importing the module does not access browser globals.
