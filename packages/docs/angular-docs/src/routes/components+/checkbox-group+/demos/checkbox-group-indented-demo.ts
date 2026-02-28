import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {CheckboxGroupModule} from "@qualcomm-ui/angular/checkbox-group"

@Component({
  imports: [CheckboxGroupModule, CheckboxModule],
  selector: "checkbox-group-indented-demo",
  template: `
    <!-- preview -->
    <fieldset indented label="Notifications" q-checkbox-group>
      <label label="Email" q-checkbox></label>
      <label label="SMS" q-checkbox></label>
      <label label="Push" q-checkbox></label>
    </fieldset>
    <!-- preview -->
  `,
})
export class CheckboxGroupIndentedDemo {}
