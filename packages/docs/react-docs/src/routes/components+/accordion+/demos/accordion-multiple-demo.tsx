import type {ReactElement} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"

import {items} from "./accordion-example-data"

export function AccordionMultipleDemo(): ReactElement {
  return (
    // preview
    <Accordion.Root className="w-96" multiple>
      {items.map((item) => (
        <Accordion.Item key={item.value} text={item.text} value={item.value}>
          {item.content}
        </Accordion.Item>
      ))}
    </Accordion.Root>
    // preview
  )
}
