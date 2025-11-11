import {Component} from "@angular/core"

import {MenuModule} from "@qualcomm-ui/angular/menu"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [MenuModule, PortalComponent],
  selector: "menu-nested-demo",
  template: `
    <!-- preview -->
    <q-menu>
      <button emphasis="primary" q-menu-button variant="fill">Show Menu</button>
      <q-portal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="new-text-file">New Text File</button>
            <button q-menu-item value="new-file">New File...</button>
            <q-menu>
              <button q-menu-trigger-item value="open-recent">
                Open Recents
              </button>

              <q-portal>
                <div q-menu-positioner>
                  <div q-menu-content>
                    <button q-menu-item value="file-1">File 1</button>
                    <button q-menu-item value="file-2">File 2</button>
                    <button q-menu-item value="file-3">File 3</button>
                  </div>
                </div>
              </q-portal>
            </q-menu>
          </div>
        </div>
      </q-portal>
    </q-menu>
    <!-- preview -->
  `,
})
export class MenuNestedDemo {}
