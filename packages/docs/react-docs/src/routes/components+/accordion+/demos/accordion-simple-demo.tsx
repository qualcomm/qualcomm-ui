import type {ReactElement} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"
import {LoremIpsum} from "@qualcomm-ui/react-core/lorem-ipsum"

export function AccordionSimpleDemo(): ReactElement {
  return (
    // preview
    <Accordion.Root className="w-96" defaultValue={["a"]}>
      <Accordion.Item
        secondaryText="Secondary text"
        text="Accordion Text 1"
        value="a"
      >
        <LoremIpsum />
      </Accordion.Item>

      <Accordion.Item
        secondaryText="Secondary text"
        text="Accordion Text 2"
        value="b"
      >
        <LoremIpsum />
      </Accordion.Item>
    </Accordion.Root>
    // preview
  )
}
