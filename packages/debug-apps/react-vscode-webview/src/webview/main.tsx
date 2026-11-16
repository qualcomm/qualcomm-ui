import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

import "@qualcomm-ui/react-vscode/styles.css"

import {App} from "./app"

import "./layout.css"
import "./preview.css"

const root = document.getElementById("root")
if (!root) {
  throw new Error("The webview HTML must contain a root element.")
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
