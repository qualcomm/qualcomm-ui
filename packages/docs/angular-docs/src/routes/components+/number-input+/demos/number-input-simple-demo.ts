import {Component} from "@angular/core"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule],
  selector: "number-input-simple-demo",
  template: `
    <!-- preview -->
    <q-number-input class="w-72" label="Label" placeholder="Enter a number" />
    <!-- preview -->
  `,
})
export class NumberInputSimpleDemo {}
