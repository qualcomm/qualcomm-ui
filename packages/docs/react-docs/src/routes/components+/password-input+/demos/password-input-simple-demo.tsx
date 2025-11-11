import type {ReactElement} from "react"

import {PasswordInput} from "@qualcomm-ui/react/password-input"

export default function PasswordInputSimpleDemo(): ReactElement {
  return (
    // preview
    <PasswordInput
      className="w-72"
      clearable
      hint="Optional hint"
      label="Password"
      placeholder="Create password"
    />
    // preview
  )
}
