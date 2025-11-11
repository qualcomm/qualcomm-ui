import {computed, Directive} from "@angular/core"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {CoreNumberInputErrorTextDirective} from "@qualcomm-ui/angular-core/number-input"

@Directive({
  selector: "[q-number-input-error-text]",
  standalone: false,
})
export class NumberInputErrorTextDirective extends CoreNumberInputErrorTextDirective {
  protected readonly qdsContext = useQdsInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getErrorTextBindings()),
    )
  }
}
