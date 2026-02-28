import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {CheckboxGroupModule} from "@qualcomm-ui/angular/checkbox-group"

@Component({
  imports: [CheckboxGroupModule, CheckboxModule],
  selector: "checkbox-group-size-demo",
  template: `
    <div class="flex flex-row gap-8">
      <fieldset label="Small" q-checkbox-group size="sm">
        <label label="Email" q-checkbox></label>
        <label label="SMS" q-checkbox></label>
      </fieldset>
      <fieldset label="Medium" q-checkbox-group size="md">
        <label label="Email" q-checkbox></label>
        <label label="SMS" q-checkbox></label>
      </fieldset>
      <fieldset label="Large" q-checkbox-group size="lg">
        <label label="Email" q-checkbox></label>
        <label label="SMS" q-checkbox></label>
      </fieldset>
    </div>
  `,
})
export class CheckboxGroupSizeDemo {}
