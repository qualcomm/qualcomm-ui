import type {ReactElement} from "react"

import {ChevronLeft, ChevronRight} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Stepper} from "@qualcomm-ui/react/stepper"

const items = [
  {content: "Contact details", title: "Step 1", value: "step-1"},
  {content: "Payment info", title: "Step 2", value: "step-2"},
  {content: "Confirmation", title: "Step 3", value: "step-3"},
]

export function StepperVerticalInlineDemo(): ReactElement {
  return (
    <Stepper.Root
      className="min-h-96"
      count={items.length}
      orientation="vertical-inline"
    >
      <Stepper.List>
        {items.map((item, index) => (
          <Stepper.Item key={item.value} index={index}>
            <Stepper.Trigger>
              <Stepper.Indicator>{index + 1}</Stepper.Indicator>
              <Stepper.Label>{item.title}</Stepper.Label>
              <Stepper.Hint>{item.content}</Stepper.Hint>
            </Stepper.Trigger>
            <Stepper.Separator />
          </Stepper.Item>
        ))}
      </Stepper.List>

      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <Stepper.Content key={item.value} index={index}>
            {item.content}
          </Stepper.Content>
        ))}

        <Stepper.CompletedContent>
          All steps completed.
        </Stepper.CompletedContent>

        <div className="mt-6 flex gap-2">
          <Stepper.PrevTrigger>
            <Button size="sm" startIcon={ChevronLeft} variant="outline">
              Back
            </Button>
          </Stepper.PrevTrigger>
          <Stepper.NextTrigger>
            <Button endIcon={ChevronRight} size="sm" variant="outline">
              Next
            </Button>
          </Stepper.NextTrigger>
        </div>
      </div>
    </Stepper.Root>
  )
}
