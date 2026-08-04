import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule],
  selector: "switch-aria-label-demo",
  template: `
    <!-- preview -->
    <label aria-label="Airplane mode" q-switch></label>
    <!-- preview -->
  `,
})
export class SwitchAriaLabelDemo {}
