import {Component, signal} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [MenuModule, PortalDirective],
  selector: "menu-controlled-state-demo",
  template: `
    <q-menu [open]="open()" (openChanged)="open.set($event)">
      <button emphasis="primary" q-menu-button variant="fill">Show Menu</button>
      <ng-container *qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="new-text-file">New Text File</button>
            <button q-menu-item value="new-file">New File...</button>
            <button q-menu-item value="open-file">Open File...</button>
            <button q-menu-item value="export">Export</button>
          </div>
        </div>
      </ng-container>
    </q-menu>
  `,
})
export class MenuControlledStateDemo {
  protected readonly open = signal(false)
}
