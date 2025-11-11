import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule],
  selector: "switch-child-directives-demo",
  template: `
    <!-- preview -->
    <label q-switch>
      <div q-switch-label>Label</div>
    </label>
    <!-- preview -->
  `,
})
export class SwitchChildDirectivesDemo {}
