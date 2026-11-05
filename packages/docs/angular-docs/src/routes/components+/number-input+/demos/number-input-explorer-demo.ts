import {Component} from "@angular/core"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule],
  selector: "number-input-explorer-demo",
  template: `
    <q-number-input
      class="w-72"
      hint="Some contextual help here"
      label="Quantity"
      placeholder="Enter a number"
    />
  `,
})
export class NumberInputExplorerDemo {}
