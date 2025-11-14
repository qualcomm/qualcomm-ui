import type {ReactElement} from "react"

import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export default function RadioCompositeLayoutDemo(): ReactElement {
  return (
    <form>
      {/* preview */}
      <RadioGroup.Root defaultValue="html" name="language">
        <RadioGroup.Label>Language</RadioGroup.Label>
        <RadioGroup.Items>
          <Radio.Root value="html">
            <Radio.HiddenInput />
            <Radio.Label>HTML</Radio.Label>
            <Radio.Control />
          </Radio.Root>
          <Radio.Root value="css">
            <Radio.HiddenInput />
            <Radio.Label>CSS</Radio.Label>
            <Radio.Control />
          </Radio.Root>
          <Radio.Root value="ts">
            <Radio.HiddenInput />
            <Radio.Label>TypeScript</Radio.Label>
            <Radio.Control />
          </Radio.Root>
        </RadioGroup.Items>
      </RadioGroup.Root>
      {/* preview */}
    </form>
  )
}
