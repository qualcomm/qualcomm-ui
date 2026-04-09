import type {ReactElement} from "react"

import {Stepper} from "@qualcomm-ui/react/stepper"

const items = [
  {content: "Contact details", title: "Step 1", value: "step-1"},
  {content: "Payment info", title: "Step 2", value: "step-2"},
  {content: "Confirmation", title: "Step 3", value: "step-3"},
]

const sizes = ["sm", "lg"] as const

export function StepperSizesDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-16">
      {sizes.map((size) => (
        <Stepper.Root key={size} count={items.length} size={size}>
          <Stepper.List>
            {items.map((item, index) => (
              <Stepper.Item key={item.value} index={index}>
                <Stepper.Trigger>
                  <Stepper.Indicator>{index + 1}</Stepper.Indicator>
                  <Stepper.Label>{item.title}</Stepper.Label>
                </Stepper.Trigger>
                <Stepper.Separator />
              </Stepper.Item>
            ))}
          </Stepper.List>

          {items.map((item, index) => (
            <Stepper.Content key={item.value} index={index}>
              {item.content}
            </Stepper.Content>
          ))}
        </Stepper.Root>
      ))}
    </div>
  )
}
