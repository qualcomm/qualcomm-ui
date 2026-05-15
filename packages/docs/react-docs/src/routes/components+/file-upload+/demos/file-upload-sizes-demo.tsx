// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {FileUpload} from "@qualcomm-ui/react/file-upload"

export function FileUploadSizesDemo() {
  return (
    // preview
    <div className="flex w-full flex-col items-center gap-8">
      <div className="w-full max-w-md">
        <FileUpload
          accept={["image/png", "image/jpg", "image/jpeg", "application/pdf"]}
          dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
          label="Upload files (Small)"
          maxFiles={5}
          size="sm"
        />
      </div>

      <div className="w-full max-w-md">
        <FileUpload
          accept={["image/png", "image/jpg", "image/jpeg", "application/pdf"]}
          dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
          label="Upload files (Medium)"
          maxFiles={5}
          size="md"
        />
      </div>

      <div className="w-full max-w-md">
        <FileUpload
          accept={["image/png", "image/jpg", "image/jpeg", "application/pdf"]}
          dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
          label="Upload files (Large)"
          maxFiles={5}
          size="lg"
        />
      </div>
    </div>
    // preview
  )
}
