import type {ReactElement} from "react"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  DollarSign,
  User,
} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Stepper} from "@qualcomm-ui/react/stepper"

const items = [
  {content: "Contact details", icon: User, title: "Step 1", value: "step-1"},
  {content: "Payment info", icon: DollarSign, title: "Step 2", value: "step-2"},
  {content: "Confirmation", icon: ChevronsUp, title: "Step 3", value: "step-3"},
]

// TODO: icon API is still being finalized
export function StepperIconDemo(): ReactElement {
  return (
    <Stepper.Root count={items.length}>
      <Stepper.List>
        {items.map((item, index) => (
          <Stepper.Item key={item.value} index={index}>
            <Stepper.Trigger>
              <Stepper.Indicator>
                <Stepper.IndicatorIcon icon={item.icon} />
              </Stepper.Indicator>
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
