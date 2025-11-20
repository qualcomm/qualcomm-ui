import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {TextInput} from "@qualcomm-ui/react/text-input"

export function TextInputControlledStateDemo(): ReactElement {
  const [value, setValue] = useState<string>("Controlled value")

  return (
    <div className="flex items-end gap-4">
      <TextInput.Root
        className="w-72"
        onValueChange={(updatedValue) => {
          console.debug("Value changed:", updatedValue)
          setValue(updatedValue)
        }}
        value={value}
      >
        <TextInput.Label>Label</TextInput.Label>
        <TextInput.InputGroup>
          <TextInput.Input placeholder="Placeholder text" />
        </TextInput.InputGroup>
      </TextInput.Root>

      <Button emphasis="primary" onClick={() => setValue("")} variant="outline">
        Reset
      </Button>
    </div>
  )
}
