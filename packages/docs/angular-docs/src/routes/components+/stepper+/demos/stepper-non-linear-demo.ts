import {Component} from "@angular/core"

import {StepperModule} from "@qualcomm-ui/angular/stepper"

@Component({
  imports: [StepperModule],
  selector: "stepper-non-linear-demo",
  template: `
    <!-- preview -->
    <div q-stepper-root [count]="items.length" [linear]="false">
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
          {{ item.title }} - {{ item.description }}
        </div>
      }
    </div>
    <!-- preview -->
  `,
})
export class StepperNonLinearDemo {
  readonly items = [
    {description: "Contact Info", title: "First", value: "first"},
    {description: "Date & Time", title: "Second", value: "second"},
    {description: "Select Rooms", title: "Third", value: "third"},
  ]
}
