import {type ReactElement, useState} from "react"

import {ChevronLeft, ChevronRight} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Stepper} from "@qualcomm-ui/react/stepper"

const items = [
  {title: "Account", value: "account"},
  {title: "Profile", value: "profile"},
  {title: "Review", value: "review"},
]

export function StepperPendingDemo(): ReactElement {
  const [pendingStep, setPendingStep] = useState<number>(1)

  return (
    <Stepper.Root count={items.length} pending={{[pendingStep]: true}}>
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
          <div className="flex items-center gap-4">
            <span>{item.title} content</span>
          </div>
        </Stepper.Content>
      ))}

      <Stepper.CompletedContent>All steps completed.</Stepper.CompletedContent>

      <Stepper.Context>
        {({step}) => (
          <div className="mt-6 flex justify-between">
            <Stepper.PrevTrigger>
              <Button size="sm" startIcon={ChevronLeft} variant="outline">
                Back
              </Button>
            </Stepper.PrevTrigger>
            <Stepper.NextTrigger>
              <Button
                endIcon={ChevronRight}
                onClick={() => setPendingStep(step + 1)}
                size="sm"
                variant="outline"
              >
                Next
              </Button>
            </Stepper.NextTrigger>
          </div>
        )}
      </Stepper.Context>
    </Stepper.Root>
  )
}
