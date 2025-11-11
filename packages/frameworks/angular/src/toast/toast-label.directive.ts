import {computed, Directive} from "@angular/core"

import {CoreToastLabelDirective} from "@qualcomm-ui/angular-core/toast"

import {useQdsToastContext} from "./qds-toast-context.service"

@Directive({
  selector: "[q-toast-label]",
  standalone: false,
})
export class ToastLabelDirective extends CoreToastLabelDirective {
  protected readonly qdsContext = useQdsToastContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getLabelBindings()),
    )
  }
}
