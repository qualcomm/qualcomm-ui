import type {ReactElement} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"
import {LoremIpsum} from "@qualcomm-ui/react-core/lorem-ipsum"

export default function AccordionCompositeDemo(): ReactElement {
  return (
    <Accordion.Root className="w-96" defaultValue={["a"]}>
      {/* preview */}
      <Accordion.ItemRoot value="a">
        <Accordion.ItemTrigger>
          <Accordion.ItemText>Accordion Text 1</Accordion.ItemText>
          <Accordion.ItemSecondaryText>
            Secondary text
          </Accordion.ItemSecondaryText>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <LoremIpsum />
        </Accordion.ItemContent>
      </Accordion.ItemRoot>
      {/* preview */}
      <Accordion.ItemRoot value="b">
        <Accordion.ItemTrigger>
          <Accordion.ItemText>Accordion Text 2</Accordion.ItemText>
          <Accordion.ItemSecondaryText>
            Secondary text
          </Accordion.ItemSecondaryText>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <LoremIpsum />
        </Accordion.ItemContent>
      </Accordion.ItemRoot>
    </Accordion.Root>
  )
}
