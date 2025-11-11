import {Component} from "@angular/core"

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule],
  selector: "password-input-composite-demo",
  template: `
    <!-- preview -->
    <div class="w-72" q-password-input-root>
      <label q-password-input-label>Label</label>
      <div q-password-input-input-group>
        <input placeholder="Placeholder text" q-password-input-input />
        <button q-password-input-clear-trigger></button>
        <button q-password-input-visibility-trigger></button>
        <span q-password-input-error-indicator></span>
      </div>
      <div q-password-input-error-text>Error text</div>
      <div q-password-input-hint>Optional hint</div>
    </div>
    <!-- preview -->
  `,
})
export class PasswordInputCompositeDemo {}
