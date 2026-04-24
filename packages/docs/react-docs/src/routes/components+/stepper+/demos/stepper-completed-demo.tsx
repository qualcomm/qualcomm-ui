import {type ReactElement, useState} from "react"

import {ChevronLeft, ChevronRight} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Stepper} from "@qualcomm-ui/react/stepper"

const items = [
  {title: "Account", value: "account"},
  {title: "Profile", value: "profile"},
  {title: "Review", value: "review"},
]

export function StepperCompletedDemo(): ReactElement {
  const [completed, setCompleted] = useState<Record<number, boolean>>({})

  function toggleCompleted(index: number) {
    setCompleted((prev) => ({...prev, [index]: !prev[index]}))
  }

  const allCompleted = items.every((_, i) => completed[i])

  return (
    <Stepper.Root completed={completed} count={items.length} linear={false}>
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
            <Button
              onClick={() => toggleCompleted(index)}
              size="sm"
              variant={completed[index] ? "outline" : "fill"}
            >
              {completed[index] ? "Mark Incomplete" : "Mark Complete"}
            </Button>
          </div>
        </Stepper.Content>
      ))}

      <Stepper.CompletedContent>All steps completed.</Stepper.CompletedContent>

      <div className="mt-6 flex justify-between">
        <Stepper.PrevTrigger>
          <Button size="sm" startIcon={ChevronLeft} variant="outline">
            Back
          </Button>
        </Stepper.PrevTrigger>
        <Stepper.Context>
          {({count, hasNextStep, step}) => (
            <Stepper.NextTrigger>
              <Button
                disabled={!hasNextStep || (step === count - 1 && !allCompleted)}
                endIcon={ChevronRight}
                size="sm"
                variant="outline"
              >
                Next
              </Button>
            </Stepper.NextTrigger>
          )}
        </Stepper.Context>
      </div>
    </Stepper.Root>
  )
}
