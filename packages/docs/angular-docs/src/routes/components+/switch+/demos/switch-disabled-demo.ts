import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule],
  selector: "switch-disabled",
  template: `
    <div class="flex flex-col gap-3">
      <!-- preview -->
      <label defaultChecked disabled label="Label" q-switch></label>
      <label disabled label="Label" q-switch></label>
      <!-- preview -->
    </div>
  `,
})
export class SwitchDisabledDemo {}
