import {type ReactElement, useState} from "react"

import {Upload} from "lucide-react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {FileInput} from "@qualcomm-ui/react/file-input"

export function FileInputDisabledDemo(): ReactElement {
  const [agreed, setAgreed] = useState(false)

  return (
    // preview
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Checkbox
        checked={agreed}
        label="I agree to the terms and conditions"
        onCheckedChange={setAgreed}
      />
      <FileInput
        disabled={!agreed}
        label="Upload approval"
        placeholder="Select a file"
        startIcon={Upload}
      />
    </div>
    // preview
  )
}
