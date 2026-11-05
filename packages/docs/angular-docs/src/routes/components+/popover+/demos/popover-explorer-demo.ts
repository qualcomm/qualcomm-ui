import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {PopoverModule} from "@qualcomm-ui/angular/popover"

@Component({
  imports: [PopoverModule, ButtonModule],
  selector: "popover-explorer-demo",
  template: `
    <div
      defaultOpen
      description="Popover content with a description."
      disablePortal
      label="Label"
      q-popover
      [positioning]="{placement: 'bottom'}"
    >
      <div q-popover-anchor>
        <button emphasis="primary" q-button q-popover-trigger>
          Show Popover
        </button>
      </div>
    </div>
  `,
})
export class PopoverExplorerDemo {}
