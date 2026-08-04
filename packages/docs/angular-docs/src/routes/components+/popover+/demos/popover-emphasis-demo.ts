import {Component} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {PopoverModule} from "@qualcomm-ui/angular/popover"
import type {QdsPopoverEmphasis} from "@qualcomm-ui/qds-core/popover"

@Component({
  imports: [PopoverModule, ButtonModule, PortalDirective],
  selector: "popover-emphasis-demo",
  template: `
    <div class="flex gap-4">
      @for (emp of emphasisOptions; track emp) {
        <div q-popover-root [emphasis]="emp">
          <div q-popover-anchor>
            <button emphasis="primary" q-button q-popover-trigger>
              {{ emp }}
            </button>
          </div>

          <ng-template qPortal>
            <div q-popover-positioner>
              <div q-popover-content>
                <div q-popover-arrow></div>
                <div q-popover-label>Label</div>
                <div q-popover-description>This is a {{ emp }} popover.</div>
              </div>
            </div>
          </ng-template>
        </div>
      }
    </div>
  `,
})
export class PopoverEmphasisDemo {
  readonly emphasisOptions: QdsPopoverEmphasis[] = ["neutral", "brand"]
}
