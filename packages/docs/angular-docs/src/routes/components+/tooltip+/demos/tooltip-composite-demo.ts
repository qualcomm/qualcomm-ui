import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [TooltipModule, ButtonModule, PortalComponent],
  selector: "tooltip-composite-demo",
  template: `
    <!-- preview -->
    <div q-tooltip-root>
      <button emphasis="primary" q-button q-tooltip-trigger variant="fill">
        Hover me
      </button>
      <q-portal>
        <div q-tooltip-positioner>
          <div q-tooltip-content>
            <div q-tooltip-arrow>
              <div q-tooltip-arrow-tip></div>
            </div>
            Hello World!
          </div>
        </div>
      </q-portal>
    </div>
    <!-- preview -->
  `,
})
export class TooltipCompositeDemo {}
