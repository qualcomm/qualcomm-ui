import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {CoreDialogCloseTriggerDirective} from "@qualcomm-ui/angular-core/dialog"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * A button that closes the dialog.
 */
@Component({
  providers: [provideIcons({X})],
  selector: "[q-dialog-close-button]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="buttonApi().getIconBindings()"></svg>
  `,
})
export class DialogCloseButtonComponent extends CoreDialogCloseTriggerDirective {
  protected readonly qdsContext = useQdsDialogContext()
  protected readonly buttonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "md",
    variant: "fixed",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.buttonApi().getRootBindings(),
          this.qdsContext().getCloseButtonBindings(),
        ),
      ),
    )
  }
}
