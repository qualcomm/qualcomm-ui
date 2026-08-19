import {Component} from "@angular/core"
import {LucideChevronLeft, LucideChevronRight} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {StepperModule} from "@qualcomm-ui/angular/stepper"

@Component({
  imports: [StepperModule, ButtonModule],
  providers: [provideIcons({LucideChevronLeft, LucideChevronRight})],
  selector: "stepper-horizontal-bottom-start-demo",
  template: `
    <!-- preview -->
    <div
      orientation="horizontal-bottom-start"
      q-stepper-root
      [count]="items.length"
    >
      <div q-stepper-list>
        @for (item of items; track item.value; let i = $index) {
          <div q-stepper-item [index]="i">
            <button q-stepper-trigger>
              <div q-stepper-indicator>{{ i + 1 }}</div>
              <span q-stepper-label>{{ item.title }}</span>
              <span q-stepper-hint>{{ item.description }}</span>
            </button>
            <div q-stepper-separator></div>
          </div>
        }
      </div>

      @for (item of items; track item.value; let i = $index) {
        <div q-stepper-content [index]="i">
          {{ item.title }} - {{ item.description }}
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
        <button
          endIcon="ChevronRight"
          q-button
          q-stepper-next-trigger
          size="sm"
          variant="outline"
        >
          Next
        </button>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class StepperHorizontalBottomStartDemo {
  readonly items = [
    {description: "Contact Info", title: "First", value: "first"},
    {description: "Date & Time", title: "Second", value: "second"},
    {description: "Select Rooms", title: "Third", value: "third"},
  ]
}
