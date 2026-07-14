import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {
  Tour,
  type TourStatusChangeDetails,
  type TourStepDetails,
} from "@qualcomm-ui/react/tour"

const steps: TourStepDetails[] = [
  {
    actions: [{action: "next", label: "Show dashboard"}],
    description:
      "Learn where to review deployments, notifications, and recent activity.",
    heading: "Explore your workspace",
    id: "welcome",
    type: "dialog",
  },
  {
    actions: [
      {action: "prev", label: "Back"},
      {action: "next", label: "Next"},
    ],
    description: "Open the dashboard to review the latest deployment status.",
    heading: "Dashboard",
    id: "dashboard",
    placement: "bottom-start",
    target: () => document.querySelector<HTMLElement>("#tour-dashboard"),
    type: "tooltip",
  },
  {
    actions: [
      {action: "prev", label: "Back"},
      {action: "dismiss", label: "Finish"},
    ],
    description:
      "Notifications keep deployment failures and approval requests visible.",
    heading: "Notifications",
    id: "notifications",
    placement: "bottom-end",
    target: () => document.querySelector<HTMLElement>("#tour-notifications"),
    type: "floating",
  },
]

export function TourBasicDemo(): ReactElement {
  const [status, setStatus] =
    useState<TourStatusChangeDetails["status"]>("idle")

  return (
    // preview
    <Tour
      onStatusChange={({status: nextStatus}) => setStatus(nextStatus)}
      steps={steps}
    >
      <div className="flex flex-col gap-4">
        <Tour.Context>
          {(tour) => (
            <Button className="self-start" onClick={() => tour.start()}>
              Start workspace tour
            </Button>
          )}
        </Tour.Context>

        <div className="flex items-center gap-3">
          <Button id="tour-dashboard" variant="outline">
            Dashboard
          </Button>
          <Button id="tour-notifications" variant="outline">
            Notifications
          </Button>
        </div>

        <p className="font-body-sm text-neutral-secondary">
          Tour status: {status}
        </p>
      </div>
    </Tour>
    // preview
  )
}
