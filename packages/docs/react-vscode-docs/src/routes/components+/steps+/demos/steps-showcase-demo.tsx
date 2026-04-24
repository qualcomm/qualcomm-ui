import type {ReactElement} from "react"

import {Steps} from "@qualcomm-ui/react-vscode/steps"

const items = [
  {description: "Contact Info", title: "First", value: "first"},
  {description: "Date & Time", title: "Second", value: "second"},
  {description: "Select Rooms", title: "Third", value: "third"},
]

export function StepsShowcaseDemo(): ReactElement {
  return (
    <Steps.Root count={items.length}>
      <Steps.List>
        {items.map((item, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Trigger>
              <Steps.Indicator>{index + 1}</Steps.Indicator>
              <span>{item.title}</span>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
    </Steps.Root>
  )
}
