import type {ReactElement} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"

import {items} from "./accordion-example-data"

export default function AccordionCompositeLayoutDemo(): ReactElement {
  return (
    // preview
    <Accordion.Root className="w-96">
      {items.map((item) => (
        <Accordion.ItemRoot key={item.value} value={item.value}>
          <Accordion.ItemTrigger>
            <Accordion.ItemIndicator />
            <Accordion.ItemText>{item.text}</Accordion.ItemText>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>{item.content}</Accordion.ItemContent>
        </Accordion.ItemRoot>
      ))}
    </Accordion.Root>
    // preview
  )
}
