import {Directive} from "@angular/core"

import {useInputInput} from "@qualcomm-ui/angular/input"
import {CorePasswordInputInputDirective} from "@qualcomm-ui/angular-core/password-input"

@Directive({
  selector: "input[q-password-input-input]",
  standalone: false,
})
export class PasswordInputInputDirective extends CorePasswordInputInputDirective {
  protected inputContext = useInputInput()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.inputContext.getBindings())
  }
}
