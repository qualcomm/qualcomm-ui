import {Component, inject} from "@angular/core"
import {
  type AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators,
} from "@angular/forms"

import {ErrorTextComponent} from "@qualcomm-ui/angular/input"
import {NumberInputModule} from "@qualcomm-ui/angular/number-input"
import {requiredNumberValidator} from "@qualcomm-ui/angular-core/number-input"

function aspectRatioValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const width = control.get("width")?.value
  const height = control.get("height")?.value
  const ratio = width / height
  return ratio >= 0.25 && ratio <= 4 ? null : {invalidAspectRatio: true}
}

@Component({
  imports: [NumberInputModule, ReactiveFormsModule, ErrorTextComponent],
  selector: "number-input-reactive-forms-demo",
  template: `
    <form class="flex flex-col gap-3" [formGroup]="aspectRatioFormGroup">
      <div class="flex flex-wrap items-start gap-2">
        <q-number-input
          class="w-56"
          errorText="Width must be between 1 and 4096"
          formControlName="width"
          label="Width"
          step="0.01"
        />
        <q-number-input
          class="w-56"
          errorText="Height must be between 1 and 4096"
          formControlName="height"
          label="Height"
          step="0.01"
        />
      </div>
      @if (aspectRatioFormGroup.hasError("invalidAspectRatio")) {
        <div q-error-text>
          Invalid aspect ratio: {{ aspectRatio() }} (must be between 0.25 and 4)
        </div>
      }
    </form>
  `,
})
export class NumberInputReactiveFormsDemo {
  protected readonly fb = inject(FormBuilder)

  aspectRatioFormGroup = this.fb.group(
    {
      height: [
        600,
        [Validators.min(1), Validators.max(4096), requiredNumberValidator],
      ],
      width: [
        800,
        [Validators.min(1), Validators.max(4096), requiredNumberValidator],
      ],
    },
    {validators: [Validators.required, aspectRatioValidator]},
  )

  aspectRatio() {
    const height = this.aspectRatioFormGroup.get("height")?.value || 1
    const width = this.aspectRatioFormGroup.get("width")?.value || 0
    return (width / height).toFixed(5)
  }
}
