import {Component, type OnInit} from "@angular/core"
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"
import {requiredNumberValidator} from "@qualcomm-ui/angular-core/number-input"

@Component({
  imports: [NumberInputModule, ReactiveFormsModule],
  selector: "number-input-reactive-form-states-demo",
  template: `
    <div class="flex w-60 flex-col gap-4">
      <q-number-input
        label="Disabled"
        placeholder="Disabled"
        [formControl]="disabledField"
      />
      <q-number-input
        label="Invalid"
        placeholder="Invalid"
        [formControl]="invalidField"
      />
      <q-number-input
        label="Required"
        placeholder="Required"
        [formControl]="requiredField"
      />
    </div>
  `,
})
export class NumberInputReactiveFormStatesDemo implements OnInit {
  // preview
  disabledField = new FormControl(5)
  invalidField = new FormControl(0, {
    validators: [Validators.min(1)],
  })
  requiredField = new FormControl(5, {validators: [requiredNumberValidator]})

  ngOnInit() {
    this.disabledField.disable()
    this.invalidField.markAsDirty()
  }
  // preview
}
