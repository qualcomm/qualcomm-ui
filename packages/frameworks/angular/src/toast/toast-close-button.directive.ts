import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreToastCloseTriggerDirective} from "@qualcomm-ui/angular-core/toast"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsToastContext} from "./qds-toast-context.service"

@Component({
  providers: [provideIcons({X})],
  selector: "[q-toast-close-button]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="X" [q-bind]="inlineIconButtonApi().getIconBindings()"></svg>
    </ng-content>
  `,
})
export class ToastCloseButtonDirective extends CoreToastCloseTriggerDirective {
  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "md",
    variant: "fixed",
  })

  protected readonly qdsContext = useQdsToastContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsContext().getCloseButtonBindings(),
          this.inlineIconButtonApi().getRootBindings(),
        ),
      ),
    )
  }
}
