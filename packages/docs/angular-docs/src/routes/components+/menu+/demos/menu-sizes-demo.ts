import {Component} from "@angular/core"
import {LucideLogOut, LucideSettings, LucideUser} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [MenuModule, PortalComponent],
  providers: [provideIcons({LucideLogOut, LucideSettings, LucideUser})],
  selector: "menu-sizes-demo",
  template: `
    <q-menu size="sm">
      <button emphasis="primary" q-menu-button>Show Menu</button>
      <q-portal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="account">
              <div icon="User" q-menu-item-start-icon></div>
              Account
            </button>
            <button q-menu-item value="settings">
              <div icon="Settings" q-menu-item-start-icon></div>
              Settings
            </button>
            <button q-menu-item value="logout">
              <div icon="LogOut" q-menu-item-start-icon></div>
              Logout
            </button>
          </div>
        </div>
      </q-portal>
    </q-menu>
  `,
})
export class MenuSizesDemo {}
