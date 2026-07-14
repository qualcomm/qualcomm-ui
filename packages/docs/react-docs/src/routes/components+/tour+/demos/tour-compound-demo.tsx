import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Tour, type TourStepDetails} from "@qualcomm-ui/react/tour"

const steps: TourStepDetails[] = [
  {
    actions: [{action: "next", label: "Next"}],
    description: "Review the filters before sharing the report.",
    heading: "Report filters",
    id: "filters",
    placement: "bottom-start",
    target: () => document.querySelector<HTMLElement>("#tour-filters"),
    type: "tooltip",
  },
  {
    actions: [
      {action: "prev", label: "Back"},
      {action: "dismiss", label: "Finish"},
    ],
    description: "Export the filtered report when the results are ready.",
    heading: "Export report",
    id: "export",
    placement: "bottom-end",
    target: () => document.querySelector<HTMLElement>("#tour-export"),
    type: "tooltip",
  },
]

export function TourCompoundDemo(): ReactElement {
  return (
    // preview
    <Tour.Root steps={steps}>
      <div className="flex flex-col gap-4">
        <Tour.Context>
          {(tour) => (
            <Button className="self-start" onClick={() => tour.start()}>
              Review report actions
            </Button>
          )}
        </Tour.Context>

        <div className="flex items-center justify-between gap-3">
          <Button id="tour-filters" variant="outline">
            Filters
          </Button>
          <Button id="tour-export" variant="outline">
            Export
          </Button>
        </div>
      </div>

      <Tour.FloatingPortal>
        <Tour.Context>
          {(tour) =>
            tour.step ? (
              <>
                <Tour.Heading>{tour.step.heading}</Tour.Heading>
                <Tour.Description>{tour.step.description}</Tour.Description>
                <Tour.ProgressText>
                  Step {tour.stepIndex + 1} of {tour.totalSteps}
                </Tour.ProgressText>
                <div className="qui-tour__action-group">
                  {tour.step.actions?.map((action) => (
                    <Tour.ActionTrigger key={action.label} action={action}>
                      {action.label}
                    </Tour.ActionTrigger>
                  ))}
                </div>
                <Tour.CloseButton />
              </>
            ) : null
          }
        </Tour.Context>
      </Tour.FloatingPortal>
    </Tour.Root>
    // preview
  )
}
