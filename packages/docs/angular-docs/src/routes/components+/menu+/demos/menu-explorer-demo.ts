import {Component, signal} from "@angular/core"
import {
  LucideCommand,
  LucideFile,
  LucideFolderOpen,
  LucidePencil,
} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [ButtonModule, MenuModule, IconDirective],
  providers: [
    provideIcons({LucideCommand, LucideFile, LucideFolderOpen, LucidePencil}),
  ],
  selector: "menu-explorer-demo",
  template: `
    <q-menu
      [open]="open()"
      [positioning]="{placement: 'bottom-start'}"
      (openChanged)="open.set($event)"
    >
      <button emphasis="primary" q-menu-button variant="fill">Actions</button>
      <div q-menu-positioner>
        <div q-menu-header>
          <div q-menu-header-label>Actions</div>
        </div>
        <div q-menu-content>
          <div q-menu-item-group>
            <label q-menu-item-group-label>File</label>
            <button q-menu-item value="new">
              <div icon="File" q-menu-item-start-icon></div>
              <div q-menu-item-label>New File</div>
              <div q-menu-item-command>
                <svg qIcon="Command" size="xs"></svg>
                N
              </div>
            </button>
            <button q-menu-item value="open">
              <div icon="FolderOpen" q-menu-item-start-icon></div>
              <div q-menu-item-label>Open File</div>
              <div q-menu-item-command>
                <svg qIcon="Command" size="xs"></svg>
                O
              </div>
              <div q-menu-item-description>Browse local files</div>
            </button>
            <button q-menu-item value="rename">
              <div icon="Pencil" q-menu-item-start-icon></div>
              <div q-menu-item-label>Rename</div>
            </button>
          </div>
          <hr q-menu-separator />
          <div q-menu-item-group>
            <label q-menu-item-group-label>Options</label>
            <button q-menu-checkbox-item value="autosave">
              <div q-menu-checkbox-item-control></div>
              <div q-menu-item-label>Autosave</div>
            </button>
            <button defaultChecked q-menu-checkbox-item value="minimap">
              <div q-menu-item-label>Minimap</div>
              <div q-menu-item-indicator></div>
            </button>
          </div>
        </div>
        <div q-menu-footer>
          <button q-button type="button" (click)="open.set(false)">Done</button>
        </div>
      </div>
    </q-menu>
  `,
})
export class MenuExplorerDemo {
  protected readonly open = signal(true)
}
