import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"
import {SwitchGroupModule} from "@qualcomm-ui/angular/switch-group"

@Component({
  imports: [SwitchGroupModule, SwitchModule],
  selector: "switch-group-orientation-demo",
  template: `
    <!-- preview -->
    <fieldset label="Notifications" orientation="horizontal" q-switch-group>
      <label label="Email" q-switch></label>
      <label label="SMS" q-switch></label>
      <label label="Push" q-switch></label>
    </fieldset>
    <!-- preview -->
  `,
})
export class SwitchGroupOrientationDemo {}
