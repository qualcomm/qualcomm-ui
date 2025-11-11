import {Directive} from "@angular/core"

import {useInputHint} from "@qualcomm-ui/angular/input"
import {CoreComboboxHintDirective} from "@qualcomm-ui/angular-core/combobox"

@Directive({
  selector: "[q-combobox-hint]",
  standalone: false,
})
export class ComboboxHintDirective extends CoreComboboxHintDirective {
  protected readonly hintContext = useInputHint()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.hintContext.getBindings())
  }
}
