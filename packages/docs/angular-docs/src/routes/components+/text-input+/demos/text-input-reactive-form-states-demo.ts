import {Component, type OnInit} from "@angular/core"
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule, ReactiveFormsModule],
  selector: "text-input-reactive-form-states-demo",
  template: `
    <div class="flex w-60 flex-col gap-4">
      <q-text-input
        label="Disabled"
        placeholder="Disabled"
        [formControl]="disabledField"
      />
      <q-text-input
        label="Invalid"
        placeholder="Invalid"
        [formControl]="invalidField"
      />
      <q-text-input
        label="Required"
        placeholder="Required"
        [formControl]="requiredField"
      />
    </div>
  `,
})
export class TextInputReactiveFormStatesDemo implements OnInit {
  // preview
  disabledField = new FormControl("")
  invalidField = new FormControl("invalid-email", {
    validators: [Validators.required, Validators.email],
  })
  requiredField = new FormControl("", {validators: [Validators.required]})

  ngOnInit() {
    this.disabledField.disable()
    this.invalidField.markAsDirty()
  }
  // preview
}
