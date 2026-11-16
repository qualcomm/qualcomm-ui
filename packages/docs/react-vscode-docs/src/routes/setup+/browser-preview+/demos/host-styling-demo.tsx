import {type FormEvent, type ReactElement, useId, useState} from "react"

import "./host-styling-demo.css"

export function HostStylingDemo(): ReactElement {
  const nameId = useId()
  const [name, setName] = useState("")
  const [reply, setReply] = useState("")

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (name.trim()) {
      setReply(`Hello, ${name.trim()}!`)
    }
  }

  return (
    <form className="vscode-host-styling-demo" onSubmit={submit}>
      <label htmlFor={nameId}>Your name</label>
      <input
        autoComplete="name"
        id={nameId}
        maxLength={64}
        onChange={(event) => setName(event.target.value)}
        required
        value={name}
      />
      <button disabled={!name.trim()} type="submit">
        Send greeting
      </button>
      <p role="status">{reply || "Enter your name to try the preview."}</p>
    </form>
  )
}
