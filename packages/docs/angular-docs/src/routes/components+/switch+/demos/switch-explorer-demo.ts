import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule],
  selector: "switch-explorer-demo",
  template: `
    <label
      hint="More context here"
      label="Enable notifications"
      q-switch
    ></label>
  `,
})
export class SwitchExplorerDemo {}
