import {Component} from "@angular/core"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule],
  selector: "number-input-composite-demo",
  template: `
    <!-- preview -->
    <div class="w-72" q-number-input-root>
      <label q-number-input-label>Label</label>
      <div q-number-input-input-group>
        <input placeholder="Enter a number" q-number-input-input />
        <div q-number-input-control></div>
        <span q-number-input-error-indicator></span>
      </div>
      <div q-number-input-error-text>Error</div>
    </div>
    <!-- preview -->
  `,
})
export class NumberInputCompositeDemo {}
