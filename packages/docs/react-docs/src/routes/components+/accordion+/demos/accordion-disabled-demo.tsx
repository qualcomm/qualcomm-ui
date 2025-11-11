import {type ReactElement, useState} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"
import {Button} from "@qualcomm-ui/react/button"
import {loremIpsum} from "@qualcomm-ui/utils/lorem-ipsum"

export const items = [
  {
    content: loremIpsum(),
    secondaryText: "Secondary text",
    text: "Accordion Text 1",
    value: "a",
  },
  {
    content: loremIpsum(),
    disabled: true,
    secondaryText: "Secondary text",
    text: "Accordion Text 2",
    value: "b",
  },
  {
    content: loremIpsum(),
    secondaryText: "Secondary text",
    text: "Accordion Text 3",
    value: "c",
  },
]

export default function AccordionDisabledDemo(): ReactElement {
  const [disabled, setDisabled] = useState(false)
  return (
    <div className="flex w-96 flex-col items-center gap-4">
      {/* preview */}
      <Accordion.Root className="w-full" disabled={disabled}>
        {items.map((item) => (
          <Accordion.Item
            key={item.value}
            disabled={item.disabled}
            text={item.text}
            value={item.value}
          >
            {item.content}
          </Accordion.Item>
        ))}
      </Accordion.Root>
      {/* preview */}
      <Button
        emphasis="primary"
        onClick={() => setDisabled(!disabled)}
        variant="fill"
      >
        {disabled ? "Enable" : "Disable"} accordion
      </Button>
    </div>
  )
}
