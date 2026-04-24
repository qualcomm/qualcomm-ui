import type {ReactElement} from "react"

import {DropdownInput} from "@qualcomm-ui/react-vscode/dropdown-input"

export function DropdownInputVariantsDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <DropdownInput defaultValue="Select an option" />
      <DropdownInput defaultValue="Select an option" variant="ghost" />
    </div>
  )
}
