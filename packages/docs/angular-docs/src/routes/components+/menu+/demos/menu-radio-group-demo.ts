import {Component} from "@angular/core"

import {MenuModule} from "@qualcomm-ui/angular/menu"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [MenuModule, PortalComponent],
  selector: "menu-radio-group-demo",
  template: `
    <q-menu>
      <button emphasis="primary" q-menu-button variant="fill">Show Menu</button>
      <q-portal>
        <div q-menu-positioner>
          <div q-menu-content>
            <!-- preview -->
            <div q-menu-radio-item-group>
              <label q-menu-item-group-label>Choose an option</label>
              <div q-menu-radio-item-group>
                <button q-menu-radio-item value="option-1">
                  Option 1
                  <div q-menu-item-indicator></div>
                </button>
                <button q-menu-radio-item value="option-2">
                  Option 2
                  <div q-menu-item-indicator></div>
                </button>
                <button q-menu-radio-item value="option-3">
                  Option 3
                  <div q-menu-item-indicator></div>
                </button>
              </div>
            </div>
            <!-- preview -->
          </div>
        </div>
      </q-portal>
    </q-menu>
  `,
})
export class MenuRadioGroupDemo {}
