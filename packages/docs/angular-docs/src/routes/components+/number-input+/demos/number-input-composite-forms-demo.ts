import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule, FormsModule],
  selector: "number-input-composite-forms-demo",
  template: `
    <div
      class="w-72"
      q-number-input-root
      [invalid]="isInvalid()"
      [(ngModel)]="value"
    >
      <label q-number-input-label>Composite Forms</label>
      <div q-number-input-input-group>
        <input placeholder="Enter a value" q-number-input-input />
        <div q-number-input-control></div>
        <span q-number-input-error-indicator></span>
      </div>
      <div q-number-input-error-text>Value must be greater than 0</div>
    </div>
  `,
})
export class NumberInputCompositeFormsDemo {
  readonly value = signal<number>(0)

  readonly isInvalid = computed(() => {
    return isNaN(this.value()) || this.value() <= 0
  })
}
