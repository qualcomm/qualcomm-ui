import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule, useQdsDialogContext} from "@qualcomm-ui/angular/dialog"
import {LoremIpsumDirective} from "@qualcomm-ui/angular-core/lorem-ipsum"

@Component({
  imports: [DialogModule, LoremIpsumDirective, ButtonModule],
  selector: "dialog-content-demo",
  template: `
    <q-dialog-floating-portal>
      <div q-dialog-body>
        <button q-dialog-close-button></button>
        <h2 q-dialog-heading>Dialog Title {{ qdsContext().size }}</h2>
        <div q-dialog-description>
          <div q-lorem-ipsum></div>
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
  `,
})
class DialogContent {
  protected readonly qdsContext = useQdsDialogContext()
}

@Component({
  imports: [DialogModule, ButtonModule, DialogContent],
  selector: "dialog-sizes-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <div q-dialog-root size="sm">
        <button emphasis="primary" q-button q-dialog-trigger variant="fill">
          Open Dialog (sm)
        </button>
        <dialog-content-demo />
      </div>
      <!-- preview -->

      <div q-dialog-root size="md">
        <button emphasis="primary" q-button q-dialog-trigger variant="fill">
          Open Dialog (md)
        </button>
        <dialog-content-demo />
      </div>
    </div>
  `,
})
export class DialogSizesDemo {}
