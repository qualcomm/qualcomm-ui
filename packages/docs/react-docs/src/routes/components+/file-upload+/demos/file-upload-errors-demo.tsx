// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useState} from "react"

import type {FileDetails} from "@qualcomm-ui/core/file-upload"
import {FileUpload} from "@qualcomm-ui/react/file-upload"

export function FileUploadErrorsDemo(): ReactElement {
  const [invalid, setInvalid] = useState(true)
  const [errorText, setErrorText] = useState("At least one file is required")

  const handleFileChange = (details: FileDetails) => {
    if (details.acceptedFiles.length > 0 && !details.rejectedFiles.length) {
      setInvalid(false)
      setErrorText("")
    } else if (details.acceptedFiles.length === 0) {
      setInvalid(true)
      setErrorText("At least one file is required")
    } else {
      setInvalid(true)
      setErrorText("Files must be .jpg, .jpeg, .png, or .pdf.")
    }
  }

  return (
    // preview
    <FileUpload
      accept={["image/png", "image/jpg", "image/jpeg", "application/pdf"]}
      className="w-full max-w-md"
      dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
      invalid={invalid}
      label="Upload files"
      maxFiles={3}
      onFileChange={handleFileChange}
      required
    >
      <FileUpload.ErrorText>{errorText}</FileUpload.ErrorText>
    </FileUpload>
    // preview
  )
}
