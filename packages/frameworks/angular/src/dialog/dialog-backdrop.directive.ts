import {Directive} from "@angular/core"

import {CoreDialogBackdropDirective} from "@qualcomm-ui/angular-core/dialog"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * The backdrop that overlays the content behind the dialog.
 */
@Directive({
  providers: [providePresenceContext()],
  selector: "[q-dialog-backdrop]",
  standalone: false,
})
export class DialogBackdropDirective extends CoreDialogBackdropDirective {
  protected readonly qdsContext = useQdsDialogContext()

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.dialogBackdropProps(),
      this.qdsContext().getBackdropBindings(),
    ),
  )

  override ngOnInit() {
    super.ngOnInit()
    this.trackBindings()
  }
}
