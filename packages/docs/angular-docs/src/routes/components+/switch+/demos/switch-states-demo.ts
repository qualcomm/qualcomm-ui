import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule],
  selector: "switch-states",
  template: `
    <div class="flex flex-col gap-3">
      <!-- preview -->
      <label defaultChecked label="Label" q-switch></label>
      <label label="Label" q-switch></label>
      <!-- preview -->
    </div>
  `,
})
export class SwitchStatesDemo {}
