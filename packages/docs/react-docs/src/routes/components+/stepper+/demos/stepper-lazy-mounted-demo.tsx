import {ChevronLeft, ChevronRight} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Stepper} from "@qualcomm-ui/react/stepper"
import {TextInput} from "@qualcomm-ui/react/text-input"

const items = [
  {title: "First", value: "first"},
  {title: "Second", value: "second"},
  {title: "Third", value: "third"},
]

export function StepperLazyMountedDemo() {
  return (
    <Stepper.Root count={items.length} lazyMount unmountOnExit>
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
          <TextInput className="w-72" label={`Step ${index + 1} field`} />
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
