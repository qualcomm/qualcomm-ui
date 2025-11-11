import {type ReactElement, useState} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"
import {LoremIpsum} from "@qualcomm-ui/react-core/lorem-ipsum"

export default function AccordionControlledStateDemo(): ReactElement {
  const [currentValue, setCurrentValue] = useState<string[]>(["a"])
  return (
    <div className="w-96">
      {/* preview */}
      <Accordion.Root
        multiple
        onValueChange={setCurrentValue}
        value={currentValue}
      >
        <Accordion.Item text="Accordion Text 1" value="a">
          <LoremIpsum />
        </Accordion.Item>
        <Accordion.Item text="Accordion Text 2" value="b">
          <LoremIpsum />
        </Accordion.Item>
        <Accordion.Item text="Accordion Text 3" value="c">
          <LoremIpsum />
        </Accordion.Item>
      </Accordion.Root>
      {/* preview */}
      <output className="font-body-sm text-neutral-primary mt-4 block">
        currently opened:
        <strong>{currentValue.sort().join(", ") || "none"}</strong>
      </output>
    </div>
  )
}
