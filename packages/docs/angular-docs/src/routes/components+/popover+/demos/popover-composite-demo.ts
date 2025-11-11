import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {PopoverModule} from "@qualcomm-ui/angular/popover"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [PopoverModule, ButtonModule, PortalDirective],
  selector: "popover-composite-demo",
  template: `
    <!-- preview -->
    <div q-popover-root>
      <div q-popover-anchor>
        <button q-button q-popover-trigger variant="outline">Click Me</button>
      </div>

      <ng-template qPortal>
        <div q-popover-positioner>
          <div q-popover-content>
            <div q-popover-arrow></div>
            <div q-popover-label>Label</div>
            <div q-popover-description>Description</div>
          </div>
        </div>
      </ng-template>
    </div>
    <!-- preview -->
  `,
})
export class PopoverCompositeDemo {}
