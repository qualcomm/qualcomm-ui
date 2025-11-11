import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule, FormsModule],
  selector: "text-input-required-template-forms-demo",
  template: `
    <!-- preview -->
    <q-text-input
      class="w-72"
      label="Required"
      placeholder="Enter a value"
      required
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class TextInputRequiredTemplateFormsDemo {
  readonly value = signal("")
}
