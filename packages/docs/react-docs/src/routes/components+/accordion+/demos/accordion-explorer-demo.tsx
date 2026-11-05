import type {ReactElement} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"

export function AccordionExplorerDemo(): ReactElement {
  return (
    <Accordion.Root className="w-96" defaultValue={["a"]}>
      <Accordion.Item
        secondaryText="Secondary text"
        text="Accordion Item 1"
        value="a"
      >
        Content for the first accordion item.
      </Accordion.Item>
      <Accordion.Item
        secondaryText="Secondary text"
        text="Accordion Item 2"
        value="b"
      >
        Content for the second accordion item.
      </Accordion.Item>
    </Accordion.Root>
  )
}
