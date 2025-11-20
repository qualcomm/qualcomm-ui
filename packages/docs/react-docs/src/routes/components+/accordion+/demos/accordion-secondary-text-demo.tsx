import type {ReactElement} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"

import {items} from "./accordion-example-data"

export function AccordionSecondaryTextDemo(): ReactElement {
  return (
    // preview
    <Accordion.Root className="w-96">
      {items.map((item) => (
        <Accordion.Item
          key={item.value}
          secondaryText={item.secondaryText}
          text={item.text}
          value={item.value}
        >
          {item.content}
        </Accordion.Item>
      ))}
    </Accordion.Root>
    // preview
  )
}
