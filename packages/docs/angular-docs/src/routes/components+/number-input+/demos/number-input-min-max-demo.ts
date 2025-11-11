import {Component} from "@angular/core"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule],
  selector: "number-input-min-max-demo",
  template: `
    <!-- preview -->
    <q-number-input class="w-72" defaultValue="7" max="10" min="5" />
    <!-- preview -->
  `,
})
export class NumberInputMinMaxDemo {}
