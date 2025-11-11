import {Component, type OnInit} from "@angular/core"
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms"

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule, ReactiveFormsModule],
  selector: "password-input-reactive-form-states-demo",
  template: `
    <div class="flex w-60 flex-col gap-4">
      <q-password-input
        label="Disabled"
        placeholder="Disabled"
        [formControl]="disabledField"
      />
      <q-password-input
        label="Invalid"
        placeholder="Invalid"
        [formControl]="invalidField"
      />
      <q-password-input
        label="Required"
        placeholder="Required"
        [formControl]="requiredField"
      />
    </div>
  `,
})
export class PasswordInputReactiveFormStatesDemo implements OnInit {
  // preview
  disabledField = new FormControl("")
  invalidField = new FormControl("", {
    validators: [Validators.required],
  })
  requiredField = new FormControl("", {validators: [Validators.required]})
  // preview

  ngOnInit() {
    this.disabledField.disable()
    this.invalidField.markAsDirty()
  }
}
