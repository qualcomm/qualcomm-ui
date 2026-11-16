# QUI React VS Code Webview Sample

Run a React/Vite application in an extension webview with the NextGen library's public host stylesheet. The package is a workspace sample, not a published extension. Native HTML controls demonstrate integration while library components are being implemented.

## Build and launch

Use Node.js 22.12 or newer for the tools, the repository's pnpm version, and VS Code 1.95 or newer.

From the repository root:

```shell
pnpm install
pnpm vscode-core build
pnpm react-vscode build
pnpm react-vscode-webview build
code packages/debug-apps/react-vscode-webview
```

Open the sample folder as the VS Code workspace root. Press F5 with **Run QUI React VS Code Sample** selected. In the Extension Development Host, run **QUI VS Code: Open React Sample** from the Command Palette.

Enter `Dust` in **Your name**, then select **Send greeting**. The panel should show **Hello, Dust!** Switch editor themes and verify that host colors update. Switch to another editor tab and return to verify that the name is restored. Closing the panel clears its state; restart serialization is not implemented.

After code changes, rebuild and close/reopen the panel. The host loads built files, not a development-server URL.

## Browser preview

Run `pnpm react-vscode-webview dev` from the repository root. Vite uses port 3410 with live updates. Use **Preview theme** to select Dark Modern, Dark+, Dark High Contrast, Light Modern, Light+, Light High Contrast, Monokai, Quiet Light, Solarized Dark, or Solarized Light. Browser fixtures use the preview colors from the legacy docs theme snapshots; installed editor themes remain owned by VS Code. Browser messaging is simulated and state resets on reload.

The React stylesheet delegates to `vscode-core`, which owns the host typography and presentation tokens.

The browser fallback activates only without `acquireVsCodeApi`. The real webview uses VS Code's host fonts, colors, and state API. It does not load QDS fonts or brand styles.

## Build outputs and runtime boundaries

- `dist/extension.cjs`: esbuild's extension-host bundle; `vscode` stays external.
- `dist/webview/webview.js`: Vite's browser bundle, including React.
- `dist/webview/webview.css`: the library's public stylesheet and sample-only CSS.

The extension uses `asWebviewUri`, a restricted `localResourceRoots`, and a fresh script nonce. CSS loads through `cspSource`; no remote resources, downloadable fonts, or inline scripts are enabled. Adding icons, images, network access, or lazy chunks requires extending the asset loader and CSP for those resources.

Messages are validated in both runtimes. The sample protocol only acknowledges readiness and returns a greeting. Render responses as text and keep Node.js and VS Code module imports in the host code.

## Verify

After building, run:

```shell
pnpm react-vscode-webview test
pnpm react-vscode-webview lint
```

The integration check needs Playwright Chromium. If it is missing, install it from the sample folder with `pnpm exec playwright install chromium`.

The checks exercise invalid message rejection, the built webview under its CSP, the greeting round trip, restored/saved state, live host variables, and text escaping. The automated test simulates the VS Code transport; use F5 to verify real host behavior.

Consumer setup pages live at `packages/docs/react-vscode-docs/src/routes/setup+`. Microsoft's [Webview API guide](https://code.visualstudio.com/api/extension-guides/webview) defines the host contracts.
