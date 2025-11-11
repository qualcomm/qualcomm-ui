import {type ReactElement, useState} from "react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

export default function NumberInputErrorTextDemo(): ReactElement {
  const [value, setValue] = useState<string>("")

  return (
    // preview
    <NumberInput
      className="w-72"
      errorText="You must enter a value"
      invalid={!value}
      label="Label"
      onValueChange={({value}) => setValue(value)}
      placeholder="Enter a value"
      value={value}
    />
    // preview
  )
}
