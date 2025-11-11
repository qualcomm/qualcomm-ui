import {computed, Directive} from "@angular/core"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {CoreNumberInputHintDirective} from "@qualcomm-ui/angular-core/number-input"

@Directive({
  selector: "[q-number-input-hint]",
  standalone: false,
})
export class NumberInputHintDirective extends CoreNumberInputHintDirective {
  protected readonly qdsContext = useQdsInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getHintBindings()),
    )
  }
}
