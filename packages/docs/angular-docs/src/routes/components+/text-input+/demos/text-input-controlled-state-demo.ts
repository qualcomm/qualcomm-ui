import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule, ButtonModule, FormsModule],
  selector: "text-input-controlled-state-demo",
  template: `
    <div class="flex items-end gap-4">
      <q-text-input
        class="w-72"
        placeholder="Placeholder text"
        [(ngModel)]="value"
      />

      <button emphasis="primary" q-button variant="outline" (click)="reset()">
        Reset
      </button>
    </div>
  `,
})
export class TextInputControlledStateDemo {
  readonly value = signal("Controlled value")

  reset() {
    this.value.set("")
  }
}
