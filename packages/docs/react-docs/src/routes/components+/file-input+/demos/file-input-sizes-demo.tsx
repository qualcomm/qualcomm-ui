import type {ReactElement} from "react"

import {Upload} from "lucide-react"

import {FileInput} from "@qualcomm-ui/react/file-input"

export function FileInputSizesDemo(): ReactElement {
  return (
    // preview
    <div className="flex w-full flex-col items-center gap-6">
      <FileInput
        className="w-full max-w-sm"
        label="Upload file (Small)"
        placeholder="Select a file"
        size="sm"
        startIcon={Upload}
      />

      <FileInput
        className="w-full max-w-sm"
        label="Upload file (Medium)"
        placeholder="Select a file"
        size="md"
        startIcon={Upload}
      />

      <FileInput
        className="w-full max-w-sm"
        label="Upload file (Large)"
        placeholder="Select a file"
        size="lg"
        startIcon={Upload}
      />
    </div>
    // preview
  )
}
