import type {ReactElement} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export default function TextInputCompositeLayoutDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <TextInput.Root size="sm">
        <div className="flex items-center gap-4">
          <TextInput.Label className="font-body-sm-bold w-48">
            Project Name
          </TextInput.Label>
          <TextInput.InputGroup>
            <TextInput.Input placeholder="QVSCE" />
          </TextInput.InputGroup>
        </div>
      </TextInput.Root>

      <TextInput.Root size="sm">
        <div className="flex items-center gap-4">
          <TextInput.Label className="font-body-sm-bold w-48">
            Project Version
          </TextInput.Label>
          <TextInput.InputGroup>
            <TextInput.Input placeholder="v1.2.3" />
          </TextInput.InputGroup>
        </div>
      </TextInput.Root>
      {/* preview */}
    </div>
  )
}
