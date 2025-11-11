import type {ReactElement} from "react"

import {Search} from "lucide-react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export default function TextInputSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* preview */}
      <TextInput
        className="w-56"
        defaultValue="sm"
        size="sm"
        startIcon={Search}
      />
      <TextInput className="w-60" defaultValue="md" startIcon={Search} />
      <TextInput
        className="w-64"
        defaultValue="lg"
        size="lg"
        startIcon={Search}
      />
      {/* preview */}
    </div>
  )
}
