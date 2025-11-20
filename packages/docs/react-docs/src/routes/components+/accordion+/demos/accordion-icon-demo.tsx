import type {ReactElement} from "react"

import {FileChartColumn} from "lucide-react"

import {Accordion} from "@qualcomm-ui/react/accordion"

import {items} from "./accordion-example-data"

export function AccordionIconDemo(): ReactElement {
  return (
    // preview
    <Accordion.Root className="w-96">
      {items.map((item) => (
        <Accordion.Item
          key={item.value}
          icon={FileChartColumn}
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
