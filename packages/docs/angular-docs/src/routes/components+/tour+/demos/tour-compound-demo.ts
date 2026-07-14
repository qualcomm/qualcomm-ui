import {DOCUMENT} from "@angular/common"
import {Component, inject} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TourModule, type TourStepDetails} from "@qualcomm-ui/angular/tour"

@Component({
  imports: [ButtonModule, TourModule],
  selector: "tour-compound-demo",
  template: `
    <!-- preview -->
    <div q-tour-root [steps]="steps">
      <div class="flex flex-col gap-4">
        <ng-container *tourContext="let tour">
          <button class="self-start" q-button (click)="tour.start()">
            Review report actions
          </button>
        </ng-container>

        <div class="flex items-center justify-between gap-3">
          <button id="angular-tour-filters" q-button variant="outline">
            Filters
          </button>
          <button id="angular-tour-export" q-button variant="outline">
            Export
          </button>
        </div>
      </div>

      <q-tour-floating-portal>
        <ng-container *tourContext="let tour">
          @if (tour.step) {
            <h2 q-tour-heading>{{ tour.step.heading }}</h2>
            <div q-tour-description>{{ tour.step.description }}</div>
            <div q-tour-progress-text>
              Step {{ tour.stepIndex + 1 }} of {{ tour.totalSteps }}
            </div>
            <div class="qui-tour__action-group">
              @for (action of tour.step.actions ?? []; track action.label) {
                <button q-tour-action-trigger [action]="action">
                  {{ action.label }}
                </button>
              }
            </div>
            <button q-tour-close-button></button>
          }
        </ng-container>
      </q-tour-floating-portal>
    </div>
    <!-- preview -->
  `,
})
export class TourCompoundDemo {
  private readonly document = inject(DOCUMENT)

  readonly steps: TourStepDetails[] = [
    {
      actions: [{action: "next", label: "Next"}],
      description: "Review the filters before sharing the report.",
      heading: "Report filters",
      id: "filters",
      placement: "bottom-start",
      target: () =>
        this.document.querySelector<HTMLElement>("#angular-tour-filters"),
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
      target: () =>
        this.document.querySelector<HTMLElement>("#angular-tour-export"),
      type: "tooltip",
    },
  ]
}
