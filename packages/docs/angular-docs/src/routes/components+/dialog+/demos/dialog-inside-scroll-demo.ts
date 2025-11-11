import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule} from "@qualcomm-ui/angular/dialog"
import {LoremIpsumDirective} from "@qualcomm-ui/angular-core/lorem-ipsum"

@Component({
  imports: [DialogModule, ButtonModule, LoremIpsumDirective],
  selector: "dialog-inside-scroll-demo",
  template: `
    <div q-dialog-root scrollBehavior="inside">
      <button emphasis="primary" q-button q-dialog-trigger variant="fill">
        Open Dialog
      </button>
      <q-dialog-floating-portal>
        <div q-dialog-body>
          <button q-dialog-close-button></button>
          <h2 q-dialog-heading>Dialog Title</h2>
          <div q-dialog-description>
            <div numParagraphs="20" q-lorem-ipsum></div>
          </div>
        </div>

        <div q-dialog-footer>
          <button q-button q-dialog-close-trigger size="sm" variant="outline">
            Close
          </button>
          <button
            emphasis="primary"
            q-button
            q-dialog-close-trigger
            size="sm"
            variant="fill"
          >
            Confirm
          </button>
        </div>
      </q-dialog-floating-portal>
    </div>
  `,
})
export class DialogInsideScrollDemo {}
