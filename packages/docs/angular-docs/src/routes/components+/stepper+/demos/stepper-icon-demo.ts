import {Component} from "@angular/core"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  DollarSign,
  User,
} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {StepperModule} from "@qualcomm-ui/angular/stepper"

@Component({
  imports: [StepperModule, ButtonModule, IconDirective],
  providers: [
    provideIcons({ChevronLeft, ChevronRight, ChevronsUp, DollarSign, User}),
  ],
  selector: "stepper-icon-demo",
  template: `
    <!-- preview -->
    <div q-stepper-root [count]="items.length">
      <div q-stepper-list>
        @for (item of items; track item.value; let i = $index) {
          <div q-stepper-item [index]="i">
            <button q-stepper-trigger>
              <div q-stepper-indicator>
                <svg q-stepper-indicator-icon [qIcon]="item.icon"></svg>
              </div>
              <span q-stepper-label>{{ item.title }}</span>
            </button>
            <div q-stepper-separator></div>
          </div>
        }
      </div>

      @for (item of items; track item.value; let i = $index) {
        <div q-stepper-content [index]="i">
          {{ item.content }}
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
export class StepperIconDemo {
  readonly items = [
    {
      content: "Contact details",
      icon: "User",
      title: "Step 1",
      value: "step-1",
    },
    {
      content: "Payment info",
      icon: "DollarSign",
      title: "Step 2",
      value: "step-2",
    },
    {
      content: "Confirmation",
      icon: "ChevronsUp",
      title: "Step 3",
      value: "step-3",
    },
  ]
}
