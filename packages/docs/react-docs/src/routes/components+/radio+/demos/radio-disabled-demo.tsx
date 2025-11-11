import type {ReactElement} from "react"

import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export default function RadioDisabledDemo(): ReactElement {
  return (
    <div className="space-y-4">
      <div className="text-neutral-primary font-heading-xxs">Disabled</div>
      <form>
        {/* preview */}
        <RadioGroup.Root defaultValue="html" disabled name="language">
          <RadioGroup.Items>
            <Radio label="HTML" value="html" />
            <Radio label="CSS" value="css" />
            <Radio label="TypeScript" value="ts" />
          </RadioGroup.Items>
        </RadioGroup.Root>
        {/* preview */}
      </form>
    </div>
  )
}
