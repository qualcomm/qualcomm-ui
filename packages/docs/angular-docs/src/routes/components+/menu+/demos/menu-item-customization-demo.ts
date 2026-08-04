import {Component} from "@angular/core"
import {Command, File, FileText, FolderOpen, ImageDown} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [MenuModule, ButtonModule, PortalDirective, IconDirective],
  providers: [provideIcons({Command, File, FileText, FolderOpen, ImageDown})],
  selector: "menu-item-customization-demo",
  template: `
    <q-menu>
      <button emphasis="primary" q-menu-button variant="fill">Show Menu</button>
      <ng-container *qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="new-text-file">
              <div icon="FileText" q-menu-item-start-icon></div>
              New Text File
              <div q-menu-item-command>
                <svg qIcon="Command" size="xs"></svg>
                E
              </div>
            </button>
            <button q-menu-item value="new-file">
              <div icon="File" q-menu-item-start-icon></div>
              New File...
              <div q-menu-item-command>
                <svg qIcon="Command" size="xs"></svg>
                N
              </div>
            </button>
            <button q-menu-item value="open-file">
              <div icon="FolderOpen" q-menu-item-start-icon></div>
              Open File...
              <div q-menu-item-command>
                <svg qIcon="Command" size="xs"></svg>
                O
              </div>
            </button>
            <button q-menu-item value="export">
              <div icon="ImageDown" q-menu-item-start-icon></div>
              Export
              <div q-menu-item-command>
                <svg qIcon="Command" size="xs"></svg>
                S
              </div>
            </button>
          </div>
        </div>
      </ng-container>
    </q-menu>
  `,
})
export class MenuItemCustomizationDemo {}
