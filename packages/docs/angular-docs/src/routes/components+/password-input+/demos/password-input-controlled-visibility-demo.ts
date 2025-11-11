import {Component, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule, ButtonModule],
  selector: "password-input-controlled-visibility-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <q-password-input
        class="w-72"
        defaultValue="passw0rd"
        label="Password"
        placeholder="Enter your password"
        [visible]="visible()"
        (visibleChanged)="setVisible($event)"
      />

      <button
        emphasis="primary"
        q-button
        variant="outline"
        (click)="toggleVisible()"
      >
        {{ visible() ? "Hide Password" : "Show Password" }}
      </button>
      <!-- preview -->
    </div>
  `,
})
export class PasswordInputControlledVisibilityDemo {
  protected readonly visible = signal(false)

  setVisible(visible: boolean) {
    this.visible.set(visible)
  }

  toggleVisible() {
    this.visible.update((visible) => !visible)
  }
}
