import type {ReactElement} from "react"

import {TextArea} from "@qualcomm-ui/react/text-area"

export function TextAreaExplorerDemo(): ReactElement {
  return (
    <TextArea
      className="w-72"
      hint="Some contextual help here"
      label="Description"
      maxLength={200}
      placeholder="Enter a description"
    />
  )
}
