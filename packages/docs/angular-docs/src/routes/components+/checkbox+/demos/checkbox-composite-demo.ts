import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

@Component({
  imports: [CheckboxModule],
  selector: "checkbox-showcase",
  template: `
    <!-- preview -->
    <label q-checkbox-root>
      <input q-checkbox-hidden-input />
      <div q-checkbox-control></div>
      <span q-checkbox-label>Label</span>
    </label>
    <!-- preview -->
  `,
})
export class CheckboxCompositeDemo {}
