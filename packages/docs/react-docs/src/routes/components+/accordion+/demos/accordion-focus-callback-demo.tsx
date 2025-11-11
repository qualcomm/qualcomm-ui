import {type ReactElement, useState} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"

import {items} from "./accordion-example-data"

export default function AccordionFocusCallbackDemo(): ReactElement {
  const [currentValue, setCurrentValue] = useState<string>("")
  return (
    <div className="w-96">
      {/* preview */}
      <Accordion.Root
        defaultValue={["a"]}
        multiple
        onFocusChange={(value) => setCurrentValue(value || "")}
      >
        {items.map((item) => (
          <Accordion.Item key={item.value} text={item.text} value={item.value}>
            {item.content}
          </Accordion.Item>
        ))}
      </Accordion.Root>
      {/* preview */}
      <output className="font-body-sm text-neutral-primary mt-4 block">
        currently focused: <strong>{currentValue || "none"}</strong>
      </output>
    </div>
  )
}
