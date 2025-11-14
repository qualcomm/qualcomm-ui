import type {ReactElement} from "react"

import {KeyRound} from "lucide-react"

import {PasswordInput} from "@qualcomm-ui/react/password-input"

export default function PasswordInputIconsDemo(): ReactElement {
  return (
    <PasswordInput
      className="w-72"
      label="Password"
      placeholder="Create password"
      startIcon={KeyRound}
    />
  )
}
