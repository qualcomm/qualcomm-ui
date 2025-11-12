import {Component, type OnInit} from "@angular/core"
import {
  type AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms"

import {SliderModule} from "@qualcomm-ui/angular/slider"

function minRangeValidator(control: AbstractControl) {
  const [min, max] = control.value
  return max - min >= 30
    ? null
    : {minRange: {actualRange: max - min, requiredRange: 30}}
}

@Component({
  imports: [SliderModule, ReactiveFormsModule],
  selector: "slider-reactive-form-states-demo",
  template: `
    <div class="flex flex-col gap-5 sm:w-80">
      <q-slider label="Disabled" [formControl]="disabledField" />
      <q-slider
        errorText="Range must be at least 30"
        hint="At least 30"
        label="Select a range"
        [formControl]="invalidField"
      />
    </div>
  `,
})
export class SliderReactiveFormStatesDemo implements OnInit {
  // preview
  disabledField = new FormControl([30, 70])
  invalidField = new FormControl([31, 60], {
    validators: [minRangeValidator],
  })

  ngOnInit() {
    this.disabledField.disable()
    this.invalidField.markAsDirty()
  }
  // preview
}
