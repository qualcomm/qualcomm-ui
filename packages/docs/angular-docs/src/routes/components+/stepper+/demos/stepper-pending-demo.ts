import {Component, computed, signal} from "@angular/core"
import {ChevronLeft, ChevronRight} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {StepperModule} from "@qualcomm-ui/angular/stepper"

@Component({
  imports: [StepperModule, ButtonModule],
  providers: [provideIcons({ChevronLeft, ChevronRight})],
  selector: "stepper-pending-demo",
  template: `
    <!-- preview -->
    <div q-stepper-root [count]="items.length" [pending]="pending()">
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
          </div>
        </div>
      }

      <div q-stepper-completed-content>All steps completed.</div>

      <ng-container *stepperContext="let api">
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
            (click)="pendingStep.set(api.step + 1)"
          >
            Next
          </button>
        </div>
      </ng-container>
    </div>
    <!-- preview -->
  `,
})
export class StepperPendingDemo {
  readonly items = [
    {title: "Account", value: "account"},
    {title: "Profile", value: "profile"},
    {title: "Review", value: "review"},
  ]
  readonly pendingStep = signal(1)

  readonly pending = computed(() => ({
    [this.pendingStep()]: true,
  }))
}
