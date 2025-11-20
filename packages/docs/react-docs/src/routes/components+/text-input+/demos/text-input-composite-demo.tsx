import type {ReactElement} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export function TextInputCompositeDemo(): ReactElement {
  return (
    // preview
    <TextInput.Root className="w-72">
      <TextInput.Label>Label</TextInput.Label>
      <TextInput.InputGroup>
        <TextInput.Input placeholder="Placeholder text" />
        <TextInput.ErrorIndicator />
      </TextInput.InputGroup>
      <TextInput.Hint>Optional hint</TextInput.Hint>
      <TextInput.ErrorText>Optional error text</TextInput.ErrorText>
    </TextInput.Root>
    // preview
  )
}
