import {type ReactElement, useState} from "react"

import type {QdsAccordionSize} from "@qualcomm-ui/qds-core/accordion"
import {Accordion} from "@qualcomm-ui/react/accordion"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

import {items} from "./accordion-example-data"

export default function AccordionSizeDemo(): ReactElement {
  const [size, setSize] = useState<QdsAccordionSize>("md")
  return (
    <div className="flex w-96 flex-col items-center gap-8">
      {/* preview */}
      <Accordion.Root className="w-full" size={size}>
        {items.map((item) => (
          <Accordion.Item key={item.value} text={item.text} value={item.value}>
            {item.content}
          </Accordion.Item>
        ))}
      </Accordion.Root>
      {/* preview */}

      <RadioGroup.Root
        defaultValue="md"
        name="size"
        onValueChange={(value) => {
          setSize((value as QdsAccordionSize) || "md")
        }}
        orientation="horizontal"
      >
        <RadioGroup.Items>
          <Radio label="Small" value="sm" />
          <Radio label="Medium" value="md" />
          <Radio label="Large" value="lg" />
        </RadioGroup.Items>
      </RadioGroup.Root>
    </div>
  )
}
