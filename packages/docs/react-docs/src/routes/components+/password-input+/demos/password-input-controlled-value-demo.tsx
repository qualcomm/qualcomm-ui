import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {PasswordInput} from "@qualcomm-ui/react/password-input"

export function PasswordInputControlledValueDemo(): ReactElement {
  const [value, setValue] = useState<string>("passw0rd")

  return (
    <div className="flex items-end gap-4">
      <PasswordInput
        className="w-72"
        label="Password"
        onValueChange={(updatedValue) => {
          console.debug("Value changed:", updatedValue)
          setValue(updatedValue)
        }}
        placeholder="Enter your password"
        value={value}
      />

      <Button emphasis="primary" onClick={() => setValue("")} variant="outline">
        Reset
      </Button>
    </div>
  )
}
