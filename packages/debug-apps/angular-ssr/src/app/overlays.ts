import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule} from "@qualcomm-ui/angular/dialog"
import {DrawerModule} from "@qualcomm-ui/angular/drawer"
import {MenuModule} from "@qualcomm-ui/angular/menu"
import {PopoverModule} from "@qualcomm-ui/angular/popover"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"
import {PortalComponent, PortalDirective} from "@qualcomm-ui/angular-core/portal"
import type {QdsDialogEmphasis} from "@qualcomm-ui/qds-core/dialog"

@Component({
  imports: [
    ButtonModule,
    DialogModule,
    DrawerModule,
    MenuModule,
    PopoverModule,
    PortalComponent,
    PortalDirective,
    TooltipModule,
  ],
  selector: "app-overlays-demo",
  styles: `
    .section {
      margin-bottom: 3rem;
    }

    .section-title {
      font: var(--font-static-heading-md-default);
      margin-bottom: 1rem;
      color: var(--color-text-neutral-primary);
    }

    .demo-container {
      padding: 2rem;
      border: 1px solid var(--color-border-neutral-01);
      border-radius: 8px;
      background-color: var(--color-background-neutral-01);
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 2rem;">
        Overlays
      </h1>

      <div class="section">
        <h2 class="section-title">Dialog</h2>
        <div class="demo-container">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            @for (color of emphasis; track color) {
              <div style="display: flex; justify-content: center;" q-dialog-root [emphasis]="color">
                <button q-button q-dialog-trigger size="sm" variant="outline">
                  {{ color }}
                </button>
                <q-dialog-floating-portal>
                  <div q-dialog-body>
                    <button q-dialog-close-button></button>
                    <h2 q-dialog-heading>Dialog Title</h2>
                    <div q-dialog-description>Dialog Description</div>
                  </div>
                  <div q-dialog-footer>
                    <button
                      q-button
                      q-dialog-close-trigger
                      size="sm"
                      variant="fill"
                    >
                      Close
                    </button>
                  </div>
                </q-dialog-floating-portal>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Drawer</h2>
        <div class="demo-container">
          <div q-drawer-root>
            <button emphasis="primary" q-button q-drawer-trigger variant="fill">
              Open Drawer
            </button>
            <q-drawer-floating-portal>
              <div q-drawer-body>
                <button q-drawer-close-button></button>
                <h2 q-drawer-heading>Drawer Title</h2>
                <div q-drawer-description>Drawer Description</div>
              </div>

              <div q-drawer-footer>
                <button q-button q-drawer-close-trigger size="sm" variant="fill">
                  Close
                </button>
              </div>
            </q-drawer-floating-portal>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Menu</h2>
        <div class="demo-container">
          <q-menu>
            <button emphasis="primary" q-menu-button variant="fill">
              Show Menu
            </button>
            <q-portal>
              <div q-menu-positioner>
                <div q-menu-content>
                  <button q-menu-item value="new-text-file">
                    New Text File
                  </button>
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
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Popover</h2>
        <div class="demo-container">
          <div q-popover-root>
            <div q-popover-anchor>
              <button q-button q-popover-trigger variant="outline">
                Click Me
              </button>
            </div>

            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-arrow></div>
                  <div q-popover-label>Label</div>
                  <div q-popover-description>Description</div>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Tooltip</h2>
        <div class="demo-container">
          <div q-tooltip-root>
            <button emphasis="primary" q-button q-tooltip-trigger variant="fill">
              Hover me
            </button>
            <q-portal>
              <div q-tooltip-positioner>
                <div q-tooltip-content>
                  <div q-tooltip-arrow>
                    <div q-tooltip-arrow-tip></div>
                  </div>
                  Hello World!
                </div>
              </div>
            </q-portal>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OverlaysDemo {
  readonly emphasis: QdsDialogEmphasis[] = [
    "neutral",
    "info",
    "success",
    "warning",
    "danger",
  ]
}
