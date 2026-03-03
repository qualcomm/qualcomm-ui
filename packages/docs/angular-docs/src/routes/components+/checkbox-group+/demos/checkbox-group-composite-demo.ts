import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {FieldGroupModule} from "@qualcomm-ui/angular/field-group"

@Component({
  imports: [FieldGroupModule, CheckboxModule],
  selector: "checkbox-group-composite-demo",
  template: `
    <!-- preview -->
    <fieldset q-field-group-root>
      <legend q-field-group-label>Notifications</legend>
      <div q-field-group-items>
        <label label="Email" q-checkbox></label>
        <label label="SMS" q-checkbox></label>
        <label label="Push" q-checkbox></label>
      </div>
      <div q-field-group-hint>Select at least one</div>
    </fieldset>
    <!-- preview -->
  `,
})
export class CheckboxGroupCompositeDemo {}
