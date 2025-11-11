import {computed, Directive} from "@angular/core"

import {CoreToastActionDirective} from "@qualcomm-ui/angular-core/toast"

import {useQdsToastContext} from "./qds-toast-context.service"

@Directive({
  selector: "[q-toast-action]",
  standalone: false,
})
export class ToastActionDirective extends CoreToastActionDirective {
  protected readonly qdsContext = useQdsToastContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getActionBindings()),
    )
  }
}
