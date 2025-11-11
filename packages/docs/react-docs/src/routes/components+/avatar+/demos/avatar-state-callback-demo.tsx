import {type ReactElement, useState} from "react"

import {Avatar} from "@qualcomm-ui/react/avatar"

export default function AvatarStateCallbackDemo(): ReactElement {
  const [currentStateValid, setCurrentStateValid] = useState<string | null>(
    null,
  )
  const [currentStateInvalid, setCurrentStateInvalid] = useState<string | null>(
    null,
  )
  return (
    <div className="flex items-center gap-4">
      {/* preview */}
      <Avatar.Root onStateChange={(event) => setCurrentStateValid(event.state)}>
        <Avatar.Image alt="John Doe" src="/images/avatar-man.png" />
        <Avatar.Content>JD</Avatar.Content>
      </Avatar.Root>
      <output>current state: {currentStateValid}</output>
      <Avatar.Root
        onStateChange={(event) => setCurrentStateInvalid(event.state)}
      >
        <Avatar.Image alt="John Doe" src="https://example.invalid" />
        <Avatar.Content>JD</Avatar.Content>
      </Avatar.Root>
      <output>current state: {currentStateInvalid}</output>
      {/* preview */}
    </div>
  )
}
