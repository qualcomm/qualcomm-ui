import type {ReactElement} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"

import {items} from "./accordion-example-data"

export default function AccordionUncontainedDemo(): ReactElement {
  return (
    // preview
    <Accordion.Root className="w-96" uncontained>
      {items.map((item) => (
        <Accordion.Item key={item.value} text={item.text} value={item.value}>
          {item.content}
        </Accordion.Item>
      ))}
    </Accordion.Root>
    // preview
  )
}
