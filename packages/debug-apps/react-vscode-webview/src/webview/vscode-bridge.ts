import {respondToWebviewMessage} from "../shared/messages"

import type {VsCodeApi} from "./vscode-api"

export const isBrowserPreview = typeof acquireVsCodeApi === "undefined"

function createBrowserPreview(): VsCodeApi {
  let state: unknown
  return {
    getState: () => state,
    postMessage: (message) => {
      const response = respondToWebviewMessage(message)
      if (response) {
        window.postMessage(response, window.location.origin)
      }
    },
    setState: (nextState) => {
      state = nextState
    },
  }
}

/**
 * Acquire once outside React rendering, including StrictMode's repeated mounts.
 * The API object stays module-local and is never attached to window.
 */
export const vscode = isBrowserPreview
  ? createBrowserPreview()
  : acquireVsCodeApi()

export function getSavedName(): string {
  const state = vscode.getState()
  if (
    state &&
    typeof state === "object" &&
    "name" in state &&
    typeof state.name === "string" &&
    state.name.length <= 64
  ) {
    return state.name
  }
  return ""
}
