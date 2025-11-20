import {type ReactElement, useState} from "react"

import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export function RadioControlledDemo(): ReactElement {
  const [value, setValue] = useState<string | null>("html")

  return (
    <form>
      {/* preview */}
      <RadioGroup.Root
        name="language"
        onValueChange={(nextValue) => {
          console.log("radio value change:", nextValue)
          setValue(nextValue)
        }}
        value={value}
      >
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
