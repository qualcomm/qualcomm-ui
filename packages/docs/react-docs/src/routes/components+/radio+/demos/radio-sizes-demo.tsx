import type {ReactElement} from "react"

import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export function RadioSizesDemo(): ReactElement {
  return (
    <>
      {/* preview */}
      <RadioGroup.Root defaultValue="html">
        <RadioGroup.Items>
          <Radio label="small (sm)" size="sm" value="sm" />
          <Radio label="medium (md)" size="md" value="md" />
          <Radio label="large (lg)" size="lg" value="lg" />
        </RadioGroup.Items>
      </RadioGroup.Root>
      {/* preview */}
    </>
  )
}
