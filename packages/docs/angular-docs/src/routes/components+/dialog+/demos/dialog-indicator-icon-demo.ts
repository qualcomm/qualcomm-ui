import {Component} from "@angular/core"
import {AArrowDown} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule} from "@qualcomm-ui/angular/dialog"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [DialogModule, ButtonModule, IconDirective],
  providers: [provideIcons({AArrowDown})],
  selector: "dialog-indicator-icon-demo",
  template: `
    <div class="flex justify-center" q-dialog-root>
      <button emphasis="primary" q-button q-dialog-trigger variant="fill">
        Open Dialog
      </button>
      <q-dialog-floating-portal>
        <!-- preview -->
        <div q-dialog-body>
          <svg q-dialog-indicator-icon qIcon="AArrowDown"></svg>
          <button q-dialog-close-button></button>
          <h2 q-dialog-heading>Dialog Title</h2>
          <div q-dialog-description>Dialog Description</div>
        </div>
        <!-- preview -->
        <div q-dialog-footer>
          <button q-button q-dialog-close-trigger size="sm" variant="fill">
            Close
          </button>
        </div>
      </q-dialog-floating-portal>
    </div>
  `,
})
export class DialogIndicatorIconDemo {}
