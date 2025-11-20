import {type ReactElement, useState} from "react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

export function NumberInputControlledDemo(): ReactElement {
  const [value, setValue] = useState<string>("")
  return (
    <NumberInput
      className="w-72"
      label="Controlled Value"
      onValueChange={({value}) => setValue(value)}
      placeholder="Placeholder"
      value={value}
    />
  )
}
