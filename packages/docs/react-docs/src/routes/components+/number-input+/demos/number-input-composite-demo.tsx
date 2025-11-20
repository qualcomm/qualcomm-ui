import type {ReactElement} from "react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

export function NumberInputCompositeDemo(): ReactElement {
  return (
    // preview
    <NumberInput.Root className="w-72">
      <NumberInput.Label>Label</NumberInput.Label>
      <NumberInput.InputGroup>
        <NumberInput.Input placeholder="Enter a number" />
        <NumberInput.Control />
        <NumberInput.ErrorIndicator />
      </NumberInput.InputGroup>
      <NumberInput.ErrorText>Error</NumberInput.ErrorText>
    </NumberInput.Root>
    // preview
  )
}
