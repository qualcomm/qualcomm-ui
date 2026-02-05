// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {FileUpload} from "@qualcomm-ui/react/file-upload"

export function FileUploadSimpleDemo() {
  return (
    // preview
    <FileUpload
      accept={["image/*"]}
      className="w-full max-w-md"
      dropzoneHint="Supported file types: Images only"
      label="Upload images"
      maxFiles={10}
    />
    // preview
  )
}
