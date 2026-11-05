import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

@Component({
  imports: [CheckboxModule],
  selector: "checkbox-explorer-demo",
  template: `
    <!-- preview -->
    <label
      defaultChecked
      hint="More context here"
      label="Example Checkbox"
      q-checkbox
    ></label>
    <!-- preview -->
  `,
})
export class CheckboxExplorerDemo {}
