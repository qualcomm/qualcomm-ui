import type {ReactElement} from "react"

import {Upload} from "lucide-react"

import {FileInput} from "@qualcomm-ui/react/file-input"

export function FileInputErrorsDemo(): ReactElement {
  return (
    // preview
    <FileInput
      accept={[".pdf"]}
      className="w-full max-w-sm"
      errorText="Upload a PDF file under 5 MB"
      invalid
      label="Tax document"
      maxFileSize={5 * 1024 * 1024}
      placeholder="Select a PDF"
      required
      startIcon={Upload}
    />
    // preview
  )
}
