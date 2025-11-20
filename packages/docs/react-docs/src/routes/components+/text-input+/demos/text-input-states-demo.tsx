import type {ReactElement} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export function TextInputStatesDemo(): ReactElement {
  return (
    <div className="flex w-60 flex-col gap-4">
      {/* preview */}
      <TextInput disabled label="Disabled" placeholder="Disabled" />
      <TextInput label="Read only" placeholder="Read only" readOnly />
      <TextInput label="Required" placeholder="Required" required />
      <TextInput
        errorText="Invalid"
        invalid
        label="Invalid"
        placeholder="Invalid"
      />
      {/* preview */}
    </div>
  )
}
