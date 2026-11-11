import type {ReactElement} from "react"

import {KeyRound} from "lucide-react"

import {PasswordInput} from "@qualcomm-ui/react/password-input"

export function PasswordInputSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* preview */}
      <PasswordInput
        aria-label="Password"
        className="w-56"
        placeholder="sm"
        size="sm"
        startIcon={KeyRound}
      />
      <PasswordInput
        aria-label="Password"
        className="w-64"
        placeholder="md"
        size="md"
        startIcon={KeyRound}
      />
      <PasswordInput
        aria-label="Password"
        className="w-72"
        placeholder="lg"
        size="lg"
        startIcon={KeyRound}
      />
      {/* preview */}
    </div>
  )
}
