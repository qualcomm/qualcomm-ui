import {Component} from "@angular/core"

import {FieldGroupModule} from "@qualcomm-ui/angular/field-group"
import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [FieldGroupModule, SwitchModule],
  selector: "switch-group-composite-demo",
  template: `
    <!-- preview -->
    <fieldset q-field-group-root>
      <legend q-field-group-label>Notifications</legend>
      <div q-field-group-items>
        <label label="Email" q-switch></label>
        <label label="SMS" q-switch></label>
        <label label="Push" q-switch></label>
      </div>
      <div q-field-group-hint>Select at least one</div>
    </fieldset>
    <!-- preview -->
  `,
})
export class SwitchGroupCompositeDemo {}
