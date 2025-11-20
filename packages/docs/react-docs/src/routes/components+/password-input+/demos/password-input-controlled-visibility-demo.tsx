import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {PasswordInput} from "@qualcomm-ui/react/password-input"

export function PasswordInputControlledVisibilityDemo(): ReactElement {
  const [visible, setVisible] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-4">
      <PasswordInput
        className="w-72"
        defaultValue="passw0rd"
        label="Password"
        onVisibleChange={setVisible}
        placeholder="Enter your password"
        visible={visible}
      />

      <Button
        emphasis="primary"
        onClick={() => setVisible(!visible)}
        variant="outline"
      >
        {visible ? "Hide Password" : "Show Password"}
      </Button>
    </div>
  )
}
