import {Component} from "@angular/core"

import {useInputGroup} from "@qualcomm-ui/angular/input"
import {CorePasswordInputInputGroupDirective} from "@qualcomm-ui/angular-core/password-input"

@Component({
  selector: "[q-password-input-input-group]",
  standalone: false,
  template: `
    <ng-content select="[q-input-start-icon]">
      @if (inputGroupContext().startIcon) {
        <div q-input-start-icon [icon]="inputGroupContext().startIcon"></div>
      }
    </ng-content>

    <ng-content />
  `,
})
export class PasswordInputInputGroupDirective extends CorePasswordInputInputGroupDirective {
  protected readonly inputGroupContext = useInputGroup()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.inputGroupContext().getBindings())
  }
}
