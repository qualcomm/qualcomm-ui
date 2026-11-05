import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

@Component({
  imports: [CheckboxModule],
  selector: "checkbox-aria-label-demo",
  template: `
    <!-- preview -->
    <label aria-label="Subscribe to updates" q-checkbox></label>
    <!-- preview -->
  `,
})
export class CheckboxAriaLabelDemo {}
