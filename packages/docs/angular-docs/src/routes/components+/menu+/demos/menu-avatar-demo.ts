import {Component} from "@angular/core"
import {LogOut, Settings, User} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {AvatarModule} from "@qualcomm-ui/angular/avatar"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [AvatarModule, MenuModule, PortalDirective],
  providers: [provideIcons({LogOut, Settings, User})],
  selector: "menu-avatar-demo",
  template: `
    <q-menu [positioning]="{placement: 'right-start'}">
      <button q-avatar q-menu-trigger status="active">
        <img alt="John Doe" q-avatar-image src="/images/avatar-man.png" />
        <div q-avatar-content>JD</div>
        <div q-avatar-status></div>
      </button>
      <ng-container *qPortal>
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
      </ng-container>
    </q-menu>
  `,
})
export class MenuAvatarDemo {}
