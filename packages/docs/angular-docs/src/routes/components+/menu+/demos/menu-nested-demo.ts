import {Component} from "@angular/core"

import {MenuModule} from "@qualcomm-ui/angular/menu"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [MenuModule, PortalDirective],
  selector: "menu-nested-demo",
  template: `
    <!-- preview -->
    <q-menu>
      <button emphasis="primary" q-menu-button variant="fill">Show Menu</button>
      <ng-container *qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="new-text-file">New Text File</button>
            <button q-menu-item value="new-file">New File...</button>
            <q-menu>
              <button q-menu-trigger-item value="open-recent">
                Open Recents
              </button>

              <ng-container *qPortal>
                <div q-menu-positioner>
                  <div q-menu-content>
                    <button q-menu-item value="file-1">File 1</button>
                    <button q-menu-item value="file-2">File 2</button>
                    <button q-menu-item value="file-3">File 3</button>
                  </div>
                </div>
              </ng-container>
            </q-menu>
          </div>
        </div>
      </ng-container>
    </q-menu>
    <!-- preview -->
  `,
})
export class MenuNestedDemo {}
