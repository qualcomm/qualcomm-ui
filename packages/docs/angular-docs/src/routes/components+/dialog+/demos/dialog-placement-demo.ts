import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule} from "@qualcomm-ui/angular/dialog"
import type {QdsDialogPlacement} from "@qualcomm-ui/qds-core/dialog"

@Component({
  imports: [DialogModule, ButtonModule],
  selector: "dialog-placement-demo",
  template: `
    <div class="flex flex-col gap-4">
      @for (placement of placements; track placement) {
        <div class="flex justify-center" q-dialog-root [placement]="placement">
          <button q-button q-dialog-trigger size="sm" variant="outline">
            Open Dialog ({{ placement }})
          </button>
          <q-dialog-floating-portal>
            <div q-dialog-body>
              <button q-dialog-close-button></button>
              <h2 q-dialog-heading>Dialog Title</h2>
              <div q-dialog-description>Dialog Description</div>
            </div>
            <div q-dialog-footer>
              <button q-button q-dialog-close-trigger size="sm" variant="fill">
                Close
              </button>
            </div>
          </q-dialog-floating-portal>
        </div>
      }
    </div>
  `,
})
export class DialogPlacementDemo {
  placements: QdsDialogPlacement[] = ["top", "center", "bottom"]
}
