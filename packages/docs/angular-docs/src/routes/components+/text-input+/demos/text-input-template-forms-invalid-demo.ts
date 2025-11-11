import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule, FormsModule],
  selector: "text-input-template-form-invalid-demo",
  template: `
    <!-- preview -->
    <q-text-input
      class="w-72"
      errorText="Must be at least 3 characters long"
      label="Label"
      placeholder="Enter a value"
      [invalid]="value().length < 2"
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class TextInputTemplateFormsInvalidDemo {
  readonly value = signal("Clear me to see the validation error")

  readonly invalid = computed(() => {
    return !this.value()
  })
}
