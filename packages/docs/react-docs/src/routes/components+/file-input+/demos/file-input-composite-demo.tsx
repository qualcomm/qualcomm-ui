import type {ReactElement} from "react"

import {Upload} from "lucide-react"

import {FileInput} from "@qualcomm-ui/react/file-input"

export function FileInputCompositeDemo(): ReactElement {
  return (
    // preview
    <FileInput.Root
      accept={[".pdf"]}
      className="w-full max-w-sm"
      startIcon={Upload}
    >
      <FileInput.Label>Upload agreement</FileInput.Label>
      <FileInput.Control>
        <FileInput.Display placeholder="Select a PDF" />
      </FileInput.Control>
      <FileInput.HiddenInput />
    </FileInput.Root>
    // preview
  )
}
