import {DOCUMENT} from "@angular/common"
import {Component, inject} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TourModule, type TourStepDetails} from "@qualcomm-ui/angular/tour"

@Component({
  imports: [ButtonModule, TourModule],
  selector: "tour-wait-step-demo",
  template: `
    <!-- preview -->
    <div q-tour [steps]="steps">
      <div class="flex max-w-sm flex-col gap-4">
        <ng-container *tourContext="let tour">
          <button class="self-start" q-button (click)="tour.start()">
            Start approval tour
          </button>
        </ng-container>

        <label class="font-body-sm flex flex-col gap-2">
          Approval code
          <input
            class="border-neutral-primary rounded-sm border px-3 py-2"
            id="angular-tour-approval-code"
            placeholder="Enter approved"
          />
        </label>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class TourWaitStepDemo {
  private readonly document = inject(DOCUMENT)

  readonly steps: TourStepDetails[] = [
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
      effect: ({next}) => {
        const input = this.document.querySelector<HTMLInputElement>(
          "#angular-tour-approval-code",
        )
        const handleInput = () => {
          if (input?.value === "approved") {
            next()
          }
        }
        input?.addEventListener("input", handleInput)
        handleInput()
        return () => input?.removeEventListener("input", handleInput)
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
      target: () =>
        this.document.querySelector<HTMLElement>("#angular-tour-approval-code"),
      type: "tooltip",
    },
  ]
}
