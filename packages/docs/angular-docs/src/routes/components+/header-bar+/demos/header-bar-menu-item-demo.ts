import {Component} from "@angular/core"
import {AArrowDown, Layers2} from "lucide-angular"

import {HeaderBarModule} from "@qualcomm-ui/angular/header-bar"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {MenuModule} from "@qualcomm-ui/angular/menu"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [HeaderBarModule, MenuModule, IconDirective, PortalDirective],
  providers: [provideIcons({AArrowDown, Layers2})],
  selector: "header-bar-menu-item-demo",
  template: `
    <!-- preview -->
    <div q-header-bar-root>
      <div q-header-bar-logo>
        <div class="bg-category-1-subtle rounded-sm p-0.5">
          <svg qIcon="Layers2" size="lg"></svg>
        </div>
        <div q-header-bar-app-title>Qualcomm AI Visualizer</div>
      </div>

      <div q-header-bar-divider></div>

      <nav q-header-bar-nav>
        <button q-header-bar-nav-item>Home</button>

        <q-menu>
          <button q-header-bar-menu-item q-menu-trigger>Menu Item</button>
          <ng-container *qPortal>
            <div q-menu-positioner>
              <div q-menu-content>
                <button q-menu-item value="menu-item-1">
                  <div icon="AArrowDown" q-menu-item-start-icon></div>
                  <div q-menu-item-label>Menu Item 1</div>
                </button>
                <button q-menu-item value="menu-item-2">
                  <div icon="AArrowDown" q-menu-item-start-icon></div>
                  <div q-menu-item-label>Menu Item 2</div>
                </button>
                <button q-menu-item value="menu-item-3">
                  <div icon="AArrowDown" q-menu-item-start-icon></div>
                  <div q-menu-item-label>Menu Item 3</div>
                </button>
              </div>
            </div>
          </ng-container>
        </q-menu>
      </nav>
    </div>
    <!-- preview -->
  `,
})
export class HeaderBarMenuItemDemo {}
