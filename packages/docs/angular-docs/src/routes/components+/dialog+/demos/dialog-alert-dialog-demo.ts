import {Component} from "@angular/core"
import {Trash2} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule} from "@qualcomm-ui/angular/dialog"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [DialogModule, ButtonModule],
  providers: [provideIcons({Trash2})],
  selector: "dialog-alert-dialog-demo",
  template: `
    <div emphasis="danger" q-dialog-root role="alertdialog">
      <button
        emphasis="danger"
        endIcon="Trash2"
        q-button
        q-dialog-trigger
        variant="outline"
      >
        Delete Account
      </button>
      <q-dialog-floating-portal>
        <div q-dialog-body>
          <button q-dialog-close-button></button>
          <h2 q-dialog-heading>Are you sure?</h2>
          <div q-dialog-description>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our systems.
          </div>
        </div>
        <div q-dialog-footer>
          <button q-button q-dialog-close-trigger size="sm" variant="outline">
            Cancel
          </button>
          <button
            emphasis="danger"
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
export class DialogAlertDialogDemo {}
