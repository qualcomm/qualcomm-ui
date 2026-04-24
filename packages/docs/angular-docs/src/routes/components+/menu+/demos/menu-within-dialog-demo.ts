import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule} from "@qualcomm-ui/angular/dialog"
import {MenuModule} from "@qualcomm-ui/angular/menu"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [MenuModule, ButtonModule, DialogModule, PortalDirective],
  selector: "menu-within-dialog-demo",
  template: `
    <div q-dialog-root>
      <button emphasis="primary" q-button q-dialog-trigger variant="fill">
        Show Dialog
      </button>

      <ng-container *qPortal>
        <div q-dialog-backdrop></div>
        <div q-dialog-positioner>
          <section class="w-72" q-dialog-content>
            <div q-dialog-body>
              <button q-dialog-close-button></button>
              <h3 q-dialog-heading>Dialog Title</h3>
              <q-menu>
                <button
                  class="place-self-start"
                  emphasis="primary"
                  q-menu-button
                  variant="fill"
                >
                  Show Menu
                </button>

                <div q-menu-positioner>
                  <div q-menu-content>
                    <button q-menu-item value="new-text-file">
                      New Text File
                    </button>
                    <button q-menu-item value="new-file">New File...</button>
                    <button q-menu-item value="open-file">Open File...</button>
                    <button q-menu-item value="export">Export</button>
                  </div>
                </div>
              </q-menu>
            </div>
          </section>
        </div>
      </ng-container>
    </div>
  `,
})
export class MenuWithinDialogDemo {}
