import type {ReactElement} from "react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

export function NumberInputStepDemo(): ReactElement {
  return (
    // preview
    <NumberInput className="w-72" placeholder="Enter a number" step={3} />
    // preview
  )
}
