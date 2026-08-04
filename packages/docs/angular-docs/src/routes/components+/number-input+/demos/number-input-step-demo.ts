import {Component} from "@angular/core"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule],
  selector: "number-input-step-demo",
  template: `
    <!-- preview -->
    <q-number-input
      aria-label="Number input with step"
      class="w-72"
      placeholder="Enter a number"
      step="3"
    />
    <!-- preview -->
  `,
})
export class NumberInputStepDemo {}
