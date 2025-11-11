import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"

@Component({
  imports: [TooltipModule, ButtonModule],
  selector: "tooltip-simple-demo",
  template: `
    <!-- preview -->
    <div q-tooltip>
      <button emphasis="primary" q-button q-tooltip-trigger variant="fill">
        Hover me
      </button>
      Hello World!
    </div>
    <!-- preview -->
  `,
})
export class TooltipSimpleDemo {}
