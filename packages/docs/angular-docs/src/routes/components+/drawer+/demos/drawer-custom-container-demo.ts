import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DrawerModule} from "@qualcomm-ui/angular/drawer"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [DrawerModule, ButtonModule, PortalComponent],
  selector: "drawer-custom-container-demo",
  template: `
    <div
      closeOnEscape="false"
      closeOnInteractOutside="false"
      preventScroll="false"
      q-drawer-root
      trapFocus="false"
    >
      <div
        #containerRef
        class="border-neutral-03 relative flex h-96 w-[600px] overflow-hidden border p-8"
      >
        <button emphasis="primary" q-button q-drawer-trigger variant="fill">
          Open Drawer
        </button>
      </div>

      <q-portal [container]="containerRef">
        <div class="absolute z-0 h-full w-full" q-drawer-positioner>
          <section q-drawer-content>
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
          </section>
        </div>
      </q-portal>
    </div>
  `,
})
export class DrawerCustomContainerDemo {}
