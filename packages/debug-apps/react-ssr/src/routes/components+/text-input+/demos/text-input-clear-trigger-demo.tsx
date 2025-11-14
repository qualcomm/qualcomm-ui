import type {ReactElement} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export default function TextInputClearTriggerDemo(): ReactElement {
  return (
    <div className="flex w-48 flex-col gap-4">
      {/* preview */}
      <TextInput defaultValue="Simple" />

      <TextInput.Root defaultValue="Composite">
        <TextInput.InputGroup>
          <TextInput.Input />
          <TextInput.ClearTrigger />
        </TextInput.InputGroup>
      </TextInput.Root>
      {/* preview */}
    </div>
  )
}
