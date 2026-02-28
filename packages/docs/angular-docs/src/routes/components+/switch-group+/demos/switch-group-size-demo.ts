import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"
import {SwitchGroupModule} from "@qualcomm-ui/angular/switch-group"

@Component({
  imports: [SwitchGroupModule, SwitchModule],
  selector: "switch-group-size-demo",
  template: `
    <div class="flex flex-row gap-8">
      <fieldset label="Small" q-switch-group size="sm">
        <label label="Email" q-switch></label>
        <label label="SMS" q-switch></label>
      </fieldset>
      <fieldset label="Medium" q-switch-group size="md">
        <label label="Email" q-switch></label>
        <label label="SMS" q-switch></label>
      </fieldset>
      <fieldset label="Large" q-switch-group size="lg">
        <label label="Email" q-switch></label>
        <label label="SMS" q-switch></label>
      </fieldset>
    </div>
  `,
})
export class SwitchGroupSizeDemo {}
