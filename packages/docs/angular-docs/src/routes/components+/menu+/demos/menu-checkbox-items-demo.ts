import {Component} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [MenuModule, PortalDirective],
  selector: "menu-checkbox-items-demo",
  template: `
    <q-menu>
      <button emphasis="primary" q-menu-button variant="fill">Show Menu</button>
      <ng-container *qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <!-- preview -->
            <div q-menu-item-group>
              <label q-menu-item-group-label>Choose an option</label>
              <button q-menu-checkbox-item value="item-1-1">
                <div q-menu-checkbox-item-control></div>
                <div q-menu-item-label>Option 1</div>
              </button>
              <button q-menu-checkbox-item value="item-1-2">
                <div q-menu-checkbox-item-control></div>
                <div q-menu-item-label>Option 2</div>
              </button>
            </div>

            <div q-menu-item-group>
              <label q-menu-item-group-label>Choose an option</label>
              <button q-menu-checkbox-item value="item-2-1">
                <div q-menu-item-label>Option 1</div>
                <div q-menu-item-indicator></div>
              </button>
              <button q-menu-checkbox-item value="item-2-2">
                <div q-menu-item-label>Option 2</div>
                <div q-menu-item-indicator></div>
              </button>
            </div>
            <!-- preview -->
          </div>
        </div>
      </ng-container>
    </q-menu>
  `,
})
export class MenuCheckboxItemsDemo {}
