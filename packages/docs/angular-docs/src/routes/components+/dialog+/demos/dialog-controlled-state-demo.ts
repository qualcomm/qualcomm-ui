import {Component, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule} from "@qualcomm-ui/angular/dialog"

@Component({
  imports: [DialogModule, ButtonModule],
  selector: "dialog-controlled-state-demo",
  template: `
    <div q-dialog-root [open]="open()" (openChanged)="onOpenChange($event)">
      <button emphasis="primary" q-button q-dialog-trigger variant="fill">
        Open Dialog
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
  `,
})
export class DialogControlledStateDemo {
  readonly open = signal(false)

  onOpenChange(open: boolean) {
    console.debug("Dialog open changed:", open)
    this.open.set(open)
  }
}
