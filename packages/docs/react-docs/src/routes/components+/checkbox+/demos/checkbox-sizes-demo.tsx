import type {ReactElement} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"

export function CheckboxSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-start gap-4">
      <Checkbox label="Small (sm)" size="sm" />
      <Checkbox label="Medium (md)" size="md" />
      <Checkbox label="Large (lg)" size="lg" />
    </div>
  )
}
