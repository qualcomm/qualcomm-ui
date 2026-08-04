import {Component} from "@angular/core"
import {Copy, FilePlus, Save} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [ButtonModule, MenuModule, PortalDirective],
  providers: [provideIcons({Copy, FilePlus, Save})],
  selector: "menu-split-button-projection-demo",
  template: `
    <q-menu [positioning]="{placement: 'bottom-end'}">
      <div emphasis="primary" q-menu-split-button size="sm">
        <button
          form="settings-form"
          name="save"
          q-button
          startIcon="Save"
          type="submit"
          (click)="onSave($event)"
        >
          Save
        </button>
      </div>
      <ng-container *qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="save-as">
              <div icon="FilePlus" q-menu-item-start-icon></div>
              Save As…
            </button>
            <button q-menu-item value="save-copy">
              <div icon="Copy" q-menu-item-start-icon></div>
              Save a Copy
            </button>
          </div>
        </div>
      </ng-container>
    </q-menu>
  `,
})
export class MenuSplitButtonProjectionDemo {
  onSave(event: MouseEvent) {
    console.log("Save", event)
  }
}
