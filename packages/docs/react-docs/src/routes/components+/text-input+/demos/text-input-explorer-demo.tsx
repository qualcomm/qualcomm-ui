import type {ReactElement} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export function TextInputExplorerDemo(): ReactElement {
  return (
    <TextInput
      className="w-72"
      clearable
      hint="Some contextual help here"
      label="Username"
      placeholder="Enter username"
    />
  )
}
