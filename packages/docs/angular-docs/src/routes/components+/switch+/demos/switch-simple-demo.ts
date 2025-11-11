import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule],
  selector: "simple-switch-demo",
  template: `
    <!-- preview -->
    <label label="Label" q-switch></label>
    <!-- preview -->
  `,
})
export class SwitchSimpleDemo {}
