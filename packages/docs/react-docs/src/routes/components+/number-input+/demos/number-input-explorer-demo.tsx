import type {ReactElement} from "react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

export function NumberInputExplorerDemo(): ReactElement {
  return (
    <NumberInput
      className="w-72"
      hint="Some contextual help here"
      label="Quantity"
      placeholder="Enter a number"
    />
  )
}
