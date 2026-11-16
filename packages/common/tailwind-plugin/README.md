# @qualcomm-ui/tailwind-plugin

Qualcomm UI Tailwind Plugin for integrating QUI design tokens and utilities with Tailwind CSS.

For documentation and usage guides:

- [React documentation](https://react.qui.qualcomm.com/)
- [Angular documentation](https://angular.qui.qualcomm.com/)

## VS Code utilities

The optional `@qualcomm-ui/tailwind-plugin/vscode.css` entry provides Tailwind 4 typography, color, shadow, and opacity utilities backed by VS Code tokens. Install `@qualcomm-ui/vscode-core` when using this entry.

```css
@import "tailwindcss";
@import "@qualcomm-ui/vscode-core/styles/components.css";
@import "@qualcomm-ui/tailwind-plugin/vscode.css";
```

Use the utilities inside a `qui-vscode` container. See [Host Theming](../../docs/react-vscode-docs/src/routes/theming+/overview.mdx) for token mappings, shadow geometry, and opacity binding setup.

## License

Licensed under the [BSD-3-Clause-Clear License](https://spdx.org/licenses/BSD-3-Clause-Clear.html).
