import {DOCUMENT} from "@angular/common"
import {Component, inject, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TourModule, type TourStepDetails} from "@qualcomm-ui/angular/tour"

@Component({
  imports: [ButtonModule, TourModule],
  selector: "tour-basic-demo",
  template: `
    <!-- preview -->
    <div q-tour [steps]="steps" (statusChanged)="status.set($event.status)">
      <div class="flex flex-col gap-4">
        <ng-container *tourContext="let tour">
          <button class="self-start" q-button (click)="tour.start()">
            Start workspace tour
          </button>
        </ng-container>

        <div class="flex items-center gap-3">
          <button id="angular-tour-dashboard" q-button variant="outline">
            Dashboard
          </button>
          <button id="angular-tour-notifications" q-button variant="outline">
            Notifications
          </button>
        </div>

        <p class="font-body-sm text-neutral-secondary">
          Tour status: {{ status() }}
        </p>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class TourBasicDemo {
  private readonly document = inject(DOCUMENT)

  readonly status = signal("idle")
  readonly steps: TourStepDetails[] = [
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
      target: () =>
        this.document.querySelector<HTMLElement>("#angular-tour-dashboard"),
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
      target: () =>
        this.document.querySelector<HTMLElement>("#angular-tour-notifications"),
      type: "floating",
    },
  ]
}
