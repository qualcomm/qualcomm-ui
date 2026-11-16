import {randomBytes} from "node:crypto"
import {commands, type ExtensionContext, Uri, ViewColumn, window} from "vscode"

import {respondToWebviewMessage} from "../shared/messages"

import {getWebviewContent} from "./webview-content"

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand("quiReactVscode.openSample", () => {
      const resourceRoot = Uri.joinPath(context.extensionUri, "dist", "webview")
      const panel = window.createWebviewPanel(
        "quiReactVscode.sample",
        "QUI React VS Code Sample",
        ViewColumn.One,
        {enableScripts: true, localResourceRoots: [resourceRoot]},
      )
      const receiver = panel.webview.onDidReceiveMessage((value: unknown) => {
        const response = respondToWebviewMessage(value)
        if (response) {
          void panel.webview.postMessage(response)
        }
      })
      panel.onDidDispose(() => receiver.dispose())
      context.subscriptions.push(panel)
      panel.webview.html = getWebviewContent({
        cspSource: panel.webview.cspSource,
        nonce: randomBytes(16).toString("hex"),
        scriptUri: panel.webview
          .asWebviewUri(Uri.joinPath(resourceRoot, "webview.js"))
          .toString(),
        styleUri: panel.webview
          .asWebviewUri(Uri.joinPath(resourceRoot, "webview.css"))
          .toString(),
      })
    }),
  )
}
