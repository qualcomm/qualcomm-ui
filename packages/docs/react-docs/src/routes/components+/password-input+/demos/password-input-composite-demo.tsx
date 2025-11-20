import type {ReactElement} from "react"

import {PasswordInput} from "@qualcomm-ui/react/password-input"

export function PasswordInputCompositeDemo(): ReactElement {
  return (
    // preview
    <PasswordInput.Root className="w-72">
      <PasswordInput.Label>Password</PasswordInput.Label>
      <PasswordInput.InputGroup>
        <PasswordInput.Input placeholder="Placeholder text" />
        <PasswordInput.VisibilityTrigger />
      </PasswordInput.InputGroup>
      <PasswordInput.Hint>Optional hint</PasswordInput.Hint>
    </PasswordInput.Root>
    // preview
  )
}
