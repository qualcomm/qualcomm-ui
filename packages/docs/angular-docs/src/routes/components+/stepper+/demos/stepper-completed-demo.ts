import {Component, computed, signal} from "@angular/core"
import {ChevronLeft, ChevronRight} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {StepperModule} from "@qualcomm-ui/angular/stepper"

@Component({
  imports: [StepperModule, ButtonModule],
  providers: [provideIcons({ChevronLeft, ChevronRight})],
  selector: "stepper-completed-demo",
  template: `
    <!-- preview -->
    <div
      q-stepper-root
      [completed]="completed()"
      [count]="items.length"
      [linear]="false"
    >
      <div q-stepper-list>
        @for (item of items; track item.value; let i = $index) {
          <div q-stepper-item [index]="i">
            <button q-stepper-trigger>
              <div q-stepper-indicator>{{ i + 1 }}</div>
              <span q-stepper-label>{{ item.title }}</span>
            </button>
            <div q-stepper-separator></div>
          </div>
        }
      </div>

      @for (item of items; track item.value; let i = $index) {
        <div q-stepper-content [index]="i">
          <div class="flex items-center gap-4">
            <span>{{ item.title }} content</span>
            <button
              q-button
              size="sm"
              [variant]="completed()[i] ? 'outline' : 'fill'"
              (click)="toggleCompleted(i)"
            >
              {{ completed()[i] ? "Mark Incomplete" : "Mark Complete" }}
            </button>
          </div>
        </div>
      }

      <div q-stepper-completed-content>All steps completed.</div>

      <div class="mt-6 flex justify-between">
        <button
          q-button
          q-stepper-prev-trigger
          size="sm"
          startIcon="ChevronLeft"
          variant="outline"
        >
          Back
        </button>
        <ng-container *stepperContext="let api">
          <button
            endIcon="ChevronRight"
            q-button
            q-stepper-next-trigger
            size="sm"
            variant="outline"
            [disabled]="
              !api.hasNextStep ||
              (api.step === api.count - 1 && !allCompleted())
            "
          >
            Next
          </button>
        </ng-container>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class StepperCompletedDemo {
  readonly items = [
    {title: "Account", value: "account"},
    {title: "Profile", value: "profile"},
    {title: "Review", value: "review"},
  ]
  readonly completed = signal<Record<number, boolean>>({})

  readonly allCompleted = computed(() => {
    const completed = this.completed()
    return this.items.every((_, index) => completed[index])
  })

  toggleCompleted(index: number) {
    this.completed.update((prev) => ({...prev, [index]: !prev[index]}))
  }
}
