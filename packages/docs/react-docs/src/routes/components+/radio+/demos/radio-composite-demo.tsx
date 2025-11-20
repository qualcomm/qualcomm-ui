import type {ReactElement} from "react"

import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export function RadioComposite(): ReactElement {
  return (
    <form>
      {/* preview */}
      <RadioGroup.Root defaultValue="html" name="language">
        <RadioGroup.Label>Language</RadioGroup.Label>
        <RadioGroup.Items>
          <Radio.Root value="html">
            <Radio.Control />
            <Radio.HiddenInput />
            <Radio.Label>HTML</Radio.Label>
          </Radio.Root>
          <Radio.Root value="css">
            <Radio.Control />
            <Radio.HiddenInput />
            <Radio.Label>CSS</Radio.Label>
          </Radio.Root>
          <Radio.Root value="ts">
            <Radio.Control />
            <Radio.HiddenInput />
            <Radio.Label>TypeScript</Radio.Label>
          </Radio.Root>
        </RadioGroup.Items>
      </RadioGroup.Root>
      {/* preview */}
    </form>
  )
}
