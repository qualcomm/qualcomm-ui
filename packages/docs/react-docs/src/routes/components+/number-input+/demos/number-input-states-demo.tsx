import type {ReactElement} from "react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

export function NumberInputStatesDemo(): ReactElement {
  return (
    <div className="flex w-60 flex-col gap-4">
      {/* preview */}
      <NumberInput disabled label="Disabled" placeholder="Disabled" />
      <NumberInput label="Read only" placeholder="Read only" readOnly />
      <NumberInput label="Required" placeholder="Required" required />
      <NumberInput
        errorText="Invalid"
        invalid
        label="Invalid"
        placeholder="Invalid"
      />
      {/* preview */}
    </div>
  )
}
