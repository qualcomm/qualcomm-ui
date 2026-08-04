import type {ReactElement} from "react"

import {PasswordInput} from "@qualcomm-ui/react/password-input"

export function PasswordInputExplorerDemo(): ReactElement {
  return (
    <PasswordInput
      className="w-72"
      clearable
      hint="Some contextual help here"
      label="Password"
      placeholder="Enter password"
    />
  )
}
