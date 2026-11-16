import {type FormEvent, useEffect, useState} from "react"

import {vscodePreviewThemes} from "@qualcomm-ui/vscode-core/preview"

import {isExtensionMessage} from "../shared/messages"

import {getSavedName, isBrowserPreview, vscode} from "./vscode-bridge"

export function App() {
  const [name, setName] = useState(getSavedName)
  const [connected, setConnected] = useState(false)
  const [reply, setReply] = useState("")
  const [previewTheme, setPreviewTheme] = useState("light-modern")

  useEffect(() => {
    const receiveMessage = (event: MessageEvent<unknown>) => {
      if (!isExtensionMessage(event.data)) {
        return
      }
      if (event.data.type === "host-ready") {
        setConnected(true)
      } else {
        setReply(event.data.text)
      }
    }
    window.addEventListener("message", receiveMessage)
    vscode.postMessage({type: "ready"})
    return () => window.removeEventListener("message", receiveMessage)
  }, [])

  useEffect(() => {
    vscode.setState({name})
  }, [name])

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (connected && name.trim()) {
      setReply("Waiting for the extension...")
      vscode.postMessage({name: name.trim(), type: "greet"})
    }
  }

  return (
    <main
      className={isBrowserPreview ? "sample vscode-preview" : "sample"}
      data-vscode-preview-theme={isBrowserPreview ? previewTheme : undefined}
    >
      <h1 className="qui-vscode-heading-1">QUI React VS Code Sample</h1>
      <p className="qui-vscode-paragraph">
        This example uses native HTML controls and the library&apos;s host
        stylesheet. NextGen components are not available yet.
      </p>
      {isBrowserPreview ? (
        <section aria-label="Browser preview">
          <p className="qui-vscode-paragraph">
            Browser preview uses simulated host colors and messaging.
          </p>
          <label htmlFor="preview-theme">Preview theme</label>
          <select
            id="preview-theme"
            onChange={(event) => setPreviewTheme(event.target.value)}
            value={previewTheme}
          >
            {vscodePreviewThemes.map(({id, label}) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </section>
      ) : null}
      <form onSubmit={submit}>
        <label htmlFor="name">Your name</label>
        <input
          autoComplete="name"
          id="name"
          maxLength={64}
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
        <button disabled={!connected || !name.trim()} type="submit">
          Send greeting
        </button>
      </form>
      <p className="qui-vscode-paragraph" role="status">
        {reply ||
          (connected
            ? isBrowserPreview
              ? "Connected to the browser simulator."
              : "Connected to the extension."
            : "Connecting to the extension...")}
      </p>
    </main>
  )
}
