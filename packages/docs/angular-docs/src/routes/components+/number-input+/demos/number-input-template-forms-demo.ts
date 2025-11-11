import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule, FormsModule],
  selector: "number-input-template-forms-demo",
  template: `
    <!-- preview -->
    <q-number-input
      class="w-72"
      errorText="Value must be greater than 0"
      label="Label"
      placeholder="Enter a value"
      [invalid]="isInvalid()"
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class NumberInputTemplateFormsDemo {
  readonly value = signal<number>(1)

  setValue(value: number) {
    this.value.set(value)
  }

  readonly isInvalid = computed(() => {
    return isNaN(this.value()) || this.value() <= 0
  })
}
