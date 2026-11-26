import {Component} from "@angular/core"
import {LucideChevronLeft, LucideChevronRight} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {StepperModule} from "@qualcomm-ui/angular/stepper"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [StepperModule, ButtonModule, TextInputModule],
  providers: [provideIcons({LucideChevronLeft, LucideChevronRight})],
  selector: "stepper-lazy-mounted-demo",
  template: `
    <!-- preview -->
    <div lazyMount q-stepper-root unmountOnExit [count]="items.length">
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
        <div #content="stepperContent" q-stepper-content [index]="i">
          @if (content.shouldRender()) {
            <q-text-input class="w-72" [label]="'Step ' + (i + 1) + ' field'" />
          }
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
export class StepperLazyMountedDemo {
  readonly items = [
    {title: "First", value: "first"},
    {title: "Second", value: "second"},
    {title: "Third", value: "third"},
  ]
}
