import type {ReactElement} from "react"

import {AArrowDown, Calendar} from "lucide-react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export default function TextInputSimpleIconsDemo(): ReactElement {
  return (
    // preview
    <TextInput
      className="w-72"
      defaultValue="Both icons"
      endIcon={Calendar}
      label="Both icons"
      startIcon={AArrowDown}
    />
    // preview
  )
}
