import type {WebviewMessage} from "../shared/messages"

export interface VsCodeApi {
  getState(): unknown
  postMessage(message: WebviewMessage): void
  setState(state: {name: string}): void
}

declare global {
  function acquireVsCodeApi(): VsCodeApi
}
