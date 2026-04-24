import {ChevronLeft, ChevronRight} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Stepper} from "@qualcomm-ui/react/stepper"

const items = [
  {description: "Contact Info", title: "First", value: "first"},
  {description: "Date & Time", title: "Second", value: "second"},
  {description: "Select Rooms", title: "Third", value: "third"},
]

export function StepperHorizontalInlineDemo() {
  return (
    <Stepper.Root count={items.length} orientation="horizontal-inline">
      <Stepper.List>
        {items.map((item, index) => (
          <Stepper.Item key={item.value} index={index}>
            <Stepper.Trigger>
              <Stepper.Indicator>{index + 1}</Stepper.Indicator>
              <Stepper.Label>{item.title}</Stepper.Label>
              <Stepper.Hint>{item.description}</Stepper.Hint>
            </Stepper.Trigger>
            <Stepper.Separator />
          </Stepper.Item>
        ))}
      </Stepper.List>

      {items.map((item, index) => (
        <Stepper.Content key={item.value} index={index}>
          {item.title} - {item.description}
        </Stepper.Content>
      ))}

      <Stepper.CompletedContent>All steps completed.</Stepper.CompletedContent>

      <div className="mt-6 flex justify-between">
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
    </Stepper.Root>
  )
}
