import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule, FormsModule],
  selector: "text-input-composite-forms-demo",
  template: `
    <!-- preview -->
    <div
      class="w-72"
      q-text-input-root
      [invalid]="isInvalid()"
      [(ngModel)]="value"
    >
      <label q-text-input-label>Composite Forms</label>
      <div q-text-input-input-group>
        <input placeholder="Enter a value" q-text-input-input />
        <button q-text-input-clear-trigger></button>
        <span q-text-input-error-indicator></span>
      </div>
      <div q-text-input-error-text>Must be at least three characters long</div>
    </div>
    <!-- preview -->
  `,
})
export class TextInputCompositeFormsDemo {
  readonly value = signal("Clear me to see the validation error")

  readonly isInvalid = computed(() => this.value().length < 2)
}
