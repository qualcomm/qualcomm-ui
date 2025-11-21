import {Component, computed, signal} from "@angular/core"
import {FormsModule, type NgForm} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule, FormsModule, ButtonModule],
  selector: "slider-template-forms-demo",
  template: `
    <!-- preview -->
    <form
      #formRef="ngForm"
      class="flex flex-col gap-5 sm:w-80"
      (ngSubmit)="onSubmit(formRef)"
    >
      <q-slider
        errorText="Range must be at least 30"
        hint="At least 30"
        label="Select a range"
        name="slider"
        [invalid]="isRangeTooSmall()"
        [(ngModel)]="value"
      />
      <button
        emphasis="primary"
        q-button
        size="sm"
        type="submit"
        variant="fill"
      >
        Submit
      </button>
    </form>
    <!-- preview -->
  `,
})
export class SliderTemplateFormsDemo {
  readonly value = signal([30, 70])

  readonly rangeDifference = computed(() => {
    const [min, max] = this.value()
    return max - min
  })

  readonly isRangeTooSmall = computed(() => {
    return this.rangeDifference() < 30
  })

  onSubmit(form: NgForm) {
    console.table(form.value)
  }
}
