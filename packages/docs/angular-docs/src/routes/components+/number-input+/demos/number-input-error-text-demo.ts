import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule, FormsModule],
  selector: "number-input-error-text-demo",
  template: `
    <q-number-input
      class="w-72"
      defaultValue="0"
      errorText="Value must be greater than 0"
      label="Label"
      placeholder="Enter a value"
      [invalid]="isInvalid()"
    />
  `,
})
export class NumberInputErrorTextDemo {
  readonly value = signal<number>(0)

  readonly isInvalid = computed(() => {
    const value = this.value()
    return isNaN(value) || value <= 0
  })
}
