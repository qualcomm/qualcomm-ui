export interface WebviewContentOptions {
  cspSource: string
  nonce: string
  scriptUri: string
  styleUri: string
}

function escapeAttribute(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      '"': "&quot;",
      "&": "&amp;",
      "'": "&#39;",
      "<": "&lt;",
      ">": "&gt;",
    }
    return replacements[character]
  })
}

/**
 * Only extension-owned URIs and a freshly generated nonce enter the HTML shell.
 * User content is passed through the message protocol and rendered as React text.
 */
export function getWebviewContent({
  cspSource,
  nonce,
  scriptUri,
  styleUri,
}: WebviewContentOptions): string {
  const policy = `default-src 'none'; style-src ${cspSource}; script-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none';`
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${escapeAttribute(policy)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>QUI React VS Code Sample</title>
    <link rel="stylesheet" href="${escapeAttribute(styleUri)}" />
  </head>
  <body class="qui-vscode">
    <div id="root"></div>
    <script type="module" nonce="${escapeAttribute(nonce)}" src="${escapeAttribute(scriptUri)}"></script>
  </body>
</html>`
}
