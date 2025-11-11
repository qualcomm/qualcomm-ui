import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule, FormsModule],
  selector: "number-input-required-template-forms-demo",
  template: `
    <!-- preview -->
    <q-number-input
      #textInput
      class="w-72"
      label="Required"
      placeholder="Enter a value"
      required
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class NumberInputRequiredTemplateFormsDemo {
  readonly value = signal<number>(0)
}
