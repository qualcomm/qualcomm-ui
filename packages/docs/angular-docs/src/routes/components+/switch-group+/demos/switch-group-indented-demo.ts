import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"
import {SwitchGroupModule} from "@qualcomm-ui/angular/switch-group"

@Component({
  imports: [SwitchGroupModule, SwitchModule],
  selector: "switch-group-indented-demo",
  template: `
    <!-- preview -->
    <fieldset indented label="Notifications" q-switch-group>
      <label label="Email" q-switch></label>
      <label label="SMS" q-switch></label>
      <label label="Push" q-switch></label>
    </fieldset>
    <!-- preview -->
  `,
})
export class SwitchGroupIndentedDemo {}
