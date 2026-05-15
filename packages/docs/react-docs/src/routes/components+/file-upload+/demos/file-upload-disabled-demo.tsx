// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useState} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {FileUpload} from "@qualcomm-ui/react/file-upload"

export function FileUploadDisabledDemo(): ReactElement {
  const [agreed, setAgreed] = useState(false)

  return (
    // preview
    <div className="flex w-full max-w-md flex-col gap-4">
      <Checkbox
        checked={agreed}
        label="I agree to the terms and conditions"
        onCheckedChange={setAgreed}
      />
      <FileUpload disabled={!agreed} label="Upload files" />
    </div>
    // preview
  )
}
