import {type ReactElement, useState} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export function TextInputErrorTextDemo(): ReactElement {
  const [value, setValue] = useState<string>("")

  return (
    // preview
    <TextInput
      className="w-64"
      errorText="You must enter a value"
      invalid={!value}
      label="Label"
      onValueChange={setValue}
      placeholder="Enter a value"
      required
      value={value}
    />
    // preview
  )
}
