import type {ReactElement} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export default function TextInputSimpleDemo(): ReactElement {
  return (
    // preview
    <TextInput
      className="w-72"
      hint="Optional hint"
      label="Label"
      placeholder="Placeholder text"
    />
    // preview
  )
}
