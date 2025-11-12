import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"
import type {ValueChangeDetails} from "@qualcomm-ui/core/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-value-callback-demo",
  template: `
    <!-- preview -->
    <div class="sm:w-80">
      <q-slider
        [defaultValue]="value"
        (valueChanged)="onValueChange($event)"
        (valueChangedEnd)="onValueChangeEnd($event)"
      />
      <output class="mt-4 block">
        live value:
        <strong>{{ value.join(", ") }}</strong>
      </output>
      <output class="mt-4 block">
        final value:
        <strong>{{ finalValue.join(", ") }}</strong>
      </output>
    </div>
    <!-- preview -->
  `,
})
export class SliderValueCallbackDemo {
  value = [25, 75]
  finalValue = [25, 75]

  onValueChange(details: ValueChangeDetails) {
    this.value = details.value
  }

  onValueChangeEnd(details: ValueChangeDetails) {
    this.finalValue = details.value
  }
}
