import type {ReactElement} from "react"

import {Upload} from "lucide-react"

import {FileInput} from "@qualcomm-ui/react/file-input"

export function FileInputSimpleDemo(): ReactElement {
  return (
    // preview
    <FileInput
      className="w-full max-w-sm"
      label="Upload file"
      placeholder="Select a file"
      startIcon={Upload}
    />
    // preview
  )
}
