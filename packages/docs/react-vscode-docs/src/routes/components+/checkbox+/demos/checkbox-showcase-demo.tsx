import type {ReactNode} from "react"

import {Checkbox} from "@qualcomm-ui/react-vscode/checkbox"

export function CheckboxShowcaseDemo(): ReactNode {
  return (
    <div className="grid justify-center">
      <form className="grid grid-cols-4 grid-rows-3 items-center gap-x-8 gap-y-4">
        <div />
        <div className="text-foreground">Checked</div>
        <div className="text-foreground">Unchecked</div>
        <div className="text-foreground">Indeterminate</div>

        <span className="text-foreground">Default</span>
        <Checkbox defaultChecked label="Label" />
        <Checkbox label="Label" />
        <Checkbox indeterminate label="Label" />

        <span className="text-foreground">Disabled</span>
        <Checkbox defaultChecked disabled label="Label" />
        <Checkbox disabled label="Label" />
        <Checkbox disabled indeterminate label="Label" />
      </form>
    </div>
  )
}
