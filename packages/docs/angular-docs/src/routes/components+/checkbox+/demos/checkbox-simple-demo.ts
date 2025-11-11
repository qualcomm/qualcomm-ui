import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

@Component({
  imports: [CheckboxModule],
  selector: "simple-checkbox-demo",
  template: `
    <!-- preview -->
    <label label="Label" q-checkbox></label>
    <!-- preview -->
  `,
})
export class CheckboxSimpleDemo {}
