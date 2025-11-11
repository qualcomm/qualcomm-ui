import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule],
  selector: "switch-composite-demo",
  template: `
    <!-- preview -->
    <label q-switch-root>
      <input q-switch-hidden-input />
      <div q-switch-control></div>
      <span q-switch-label>Label</span>
    </label>
    <!-- preview -->
  `,
})
export class SwitchCompositeDemo {}
