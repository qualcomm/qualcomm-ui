import {Component} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [MenuModule, PortalDirective],
  selector: "menu-radio-group-demo",
  template: `
    <q-menu>
      <button emphasis="primary" q-menu-button variant="fill">Show Menu</button>
      <ng-container *qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <!-- preview -->
            <div q-menu-radio-item-group>
              <label q-menu-item-group-label>Choose an option</label>
              <button q-menu-radio-item value="one">
                <div q-menu-radio-item-control></div>
                <div q-menu-item-label>Option 1</div>
              </button>
              <button q-menu-radio-item value="two">
                <div q-menu-radio-item-control></div>
                <div q-menu-item-label>Option 2</div>
              </button>
              <button q-menu-radio-item value="three">
                <div q-menu-radio-item-control></div>
                <div q-menu-item-label>Option 3</div>
              </button>
            </div>
            <!-- preview -->
          </div>
        </div>
      </ng-container>
    </q-menu>
  `,
})
export class MenuRadioGroupDemo {}
