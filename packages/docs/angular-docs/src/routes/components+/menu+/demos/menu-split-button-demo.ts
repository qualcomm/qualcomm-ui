import {Component} from "@angular/core"
import {
  LucideDownload,
  LucideFileArchive,
  LucideFileBraces,
  LucideFileText,
} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [MenuModule, PortalDirective],
  providers: [
    provideIcons({
      LucideDownload,
      LucideFileArchive,
      LucideFileBraces,
      LucideFileText,
    }),
  ],
  selector: "menu-split-button-demo",
  template: `
    <q-menu [positioning]="{placement: 'bottom-end'}">
      <div
        aria-label="Download"
        emphasis="primary"
        q-menu-split-button
        startIcon="Download"
        (actionClicked)="onDownload()"
      >
        Download
      </div>
      <ng-container *qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="pdf">
              <div icon="LucideFileText" q-menu-item-start-icon></div>
              Download as PDF
            </button>
            <button q-menu-item value="json">
              <div icon="FileJson" q-menu-item-start-icon></div>
              Download as JSON
            </button>
            <button q-menu-item value="zip">
              <div icon="FileArchive" q-menu-item-start-icon></div>
              Download as ZIP
            </button>
          </div>
        </div>
      </ng-container>
    </q-menu>
  `,
})
export class MenuSplitButtonDemo {
  onDownload() {
    console.log("Download")
  }
}
