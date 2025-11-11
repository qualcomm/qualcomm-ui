import {Component} from "@angular/core"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule],
  selector: "number-input-child-directives-demo",
  template: `
    <!-- preview -->
    <q-number-input class="w-72" placeholder="Enter a number">
      <label q-number-input-label>Label</label>
    </q-number-input>
    <!-- preview -->
  `,
})
export class NumberInputChildDirectivesDemo {}
