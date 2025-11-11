import {Component, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DrawerModule} from "@qualcomm-ui/angular/drawer"

@Component({
  imports: [DrawerModule, ButtonModule],
  selector: "drawer-controlled-state-demo",
  template: `
    <div q-drawer-root [open]="open()" (openChanged)="onOpenChange($event)">
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
  `,
})
export class DrawerControlledStateDemo {
  readonly open = signal(false)

  onOpenChange(open: boolean) {
    console.debug("Drawer open changed:", open)
    this.open.set(open)
  }
}
