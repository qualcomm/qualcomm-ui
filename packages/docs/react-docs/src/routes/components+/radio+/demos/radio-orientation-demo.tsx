import type {ReactElement} from "react"

import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export default function RadioOrientationDemo(): ReactElement {
  return (
    <form>
      {/* preview */}
      <RadioGroup.Root
        defaultValue="html"
        name="language"
        orientation="horizontal"
      >
        <RadioGroup.Label>Language</RadioGroup.Label>
        <RadioGroup.Items>
          <Radio label="HTML" value="html" />
          <Radio label="CSS" value="css" />
          <Radio label="TypeScript" value="ts" />
        </RadioGroup.Items>
      </RadioGroup.Root>
      {/* preview */}
    </form>
  )
}
