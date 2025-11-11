import {computed, Directive} from "@angular/core"

import {CoreToastDescriptionDirective} from "@qualcomm-ui/angular-core/toast"

import {useQdsToastContext} from "./qds-toast-context.service"

@Directive({
  selector: "[q-toast-description]",
  standalone: false,
})
export class ToastDescriptionDirective extends CoreToastDescriptionDirective {
  protected readonly qdsContext = useQdsToastContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getDescriptionBindings()),
    )
  }
}
