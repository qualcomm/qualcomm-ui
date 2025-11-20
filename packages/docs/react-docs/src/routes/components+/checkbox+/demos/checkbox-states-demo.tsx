import type {ReactElement} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"

export function CheckboxStatesDemo(): ReactElement {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-2">
      <div className="text-neutral-primary font-heading-xxs">Checked</div>
      <div className="text-neutral-primary font-heading-xxs">Unchecked</div>
      <div className="text-neutral-primary font-heading-xxs">Indeterminate</div>

      {/* preview */}
      <Checkbox defaultChecked label="Label" />
      <Checkbox label="Label" />
      <Checkbox indeterminate label="Label" />
      {/* preview */}
    </div>
  )
}
