import {Component} from "@angular/core"

import {StepperModule} from "@qualcomm-ui/angular/stepper"

@Component({
  imports: [StepperModule],
  selector: "stepper-sizes-demo",
  template: `
    <!-- preview -->
    <div class="flex w-full flex-col gap-16">
      @for (size of sizes; track size) {
        <div q-stepper-root [count]="items.length" [size]="size">
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
              {{ item.content }}
            </div>
          }
        </div>
      }
    </div>
    <!-- preview -->
  `,
})
export class StepperSizesDemo {
  readonly items = [
    {content: "Contact details", title: "Step 1", value: "step-1"},
    {content: "Payment info", title: "Step 2", value: "step-2"},
    {content: "Confirmation", title: "Step 3", value: "step-3"},
  ]
  readonly sizes = ["sm", "lg"] as const
}
