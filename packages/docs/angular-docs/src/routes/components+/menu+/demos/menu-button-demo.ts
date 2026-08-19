import {Component} from "@angular/core"
import {
  LucideCopy,
  LucideEllipsis,
  LucideFile,
  LucideFileText,
  LucideFolderOpen,
  LucidePencil,
  LucideTrash2,
} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [MenuModule, PortalComponent],
  providers: [
    provideIcons({
      LucideCopy,
      LucideEllipsis,
      LucideFile,
      LucideFileText,
      LucideFolderOpen,
      LucidePencil,
      LucideTrash2,
    }),
  ],
  selector: "menu-button-demo",
  template: `
    <div class="flex gap-2.5">
      <q-menu [positioning]="{placement: 'bottom-end'}">
        <button emphasis="primary" q-menu-button startIcon="File">File</button>
        <q-portal>
          <div q-menu-positioner>
            <div q-menu-content>
              <button q-menu-item value="new-text-file">
                <div icon="LucideFileText" q-menu-item-start-icon></div>
                New Text File
              </button>
              <button q-menu-item value="new-file">
                <div icon="File" q-menu-item-start-icon></div>
                New File...
              </button>
              <button q-menu-item value="open-file">
                <div icon="FolderOpen" q-menu-item-start-icon></div>
                Open File...
              </button>
            </div>
          </div>
        </q-portal>
      </q-menu>

      <q-menu size="sm">
        <button
          aria-label="More actions"
          emphasis="primary"
          icon="Ellipsis"
          q-menu-icon-button
        ></button>
        <q-portal>
          <div q-menu-positioner>
            <div q-menu-content>
              <button q-menu-item value="rename">
                <div icon="Pencil" q-menu-item-start-icon></div>
                Rename
              </button>
              <button q-menu-item value="duplicate">
                <div icon="Copy" q-menu-item-start-icon></div>
                Duplicate
              </button>
              <button q-menu-item value="delete">
                <div icon="Trash2" q-menu-item-start-icon></div>
                Delete
              </button>
            </div>
          </div>
        </q-portal>
      </q-menu>
    </div>
  `,
})
export class MenuButtonDemo {}
