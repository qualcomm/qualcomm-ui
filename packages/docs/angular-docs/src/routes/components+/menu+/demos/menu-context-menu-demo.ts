import {Component} from "@angular/core"

import {MenuModule} from "@qualcomm-ui/angular/menu"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [MenuModule, PortalComponent],
  selector: "menu-context-menu-demo",
  template: `
    <q-menu class="w-full">
      <button
        class="flex h-48 w-full flex-1 items-center justify-center border border-dashed"
        q-menu-context-trigger
      >
        Right click here
      </button>
      <q-portal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="new-text-file">New Text File</button>
            <button q-menu-item value="new-file">New File...</button>
            <button q-menu-item value="open-file">Open File...</button>
            <button q-menu-item value="export">Export</button>
          </div>
        </div>
      </q-portal>
    </q-menu>
  `,
})
export class MenuContextMenuDemo {}
