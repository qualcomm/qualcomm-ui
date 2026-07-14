import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {
  Tour,
  type TourStepDetails,
  waitForElementValue,
} from "@qualcomm-ui/react/tour"

const steps: TourStepDetails[] = [
  {
    actions: [{action: "next", label: "Enter approval code"}],
    description:
      "The tour pauses while you complete a required task in the application.",
    heading: "Approve the deployment",
    id: "introduction",
    type: "dialog",
  },
  {
    description: "Enter approved to continue.",
    effect({next}) {
      const [valueEntered, cleanup] = waitForElementValue(
        () => document.querySelector<HTMLInputElement>("#tour-approval-code"),
        "approved",
        {timeout: 30_000},
      )
      void valueEntered.then(next).catch(() => {})
      return cleanup
    },
    heading: "Enter the approval code",
    id: "wait-for-approval",
    type: "wait",
  },
  {
    actions: [{action: "dismiss", label: "Finish"}],
    description: "The deployment is ready for its final review.",
    heading: "Approval received",
    id: "complete",
    placement: "top",
    target: () => document.querySelector<HTMLElement>("#tour-approval-code"),
    type: "tooltip",
  },
]

export function TourWaitStepDemo(): ReactElement {
  return (
    // preview
    <Tour steps={steps}>
      <div className="flex max-w-sm flex-col gap-4">
        <Tour.Context>
          {(tour) => (
            <Button className="self-start" onClick={() => tour.start()}>
              Start approval tour
            </Button>
          )}
        </Tour.Context>

        <label className="font-body-sm flex flex-col gap-2">
          Approval code
          <input
            className="border-neutral-primary rounded-sm border px-3 py-2"
            id="tour-approval-code"
            placeholder="Enter approved"
          />
        </label>
      </div>
    </Tour>
    // preview
  )
}
