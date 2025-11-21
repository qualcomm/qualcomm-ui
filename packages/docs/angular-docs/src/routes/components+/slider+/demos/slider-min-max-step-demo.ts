import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-min-max-step-demo",
  template: `
    <!-- preview -->
    <q-slider
      class="sm:w-80"
      [defaultValue]="[50]"
      [max]="70"
      [min]="20"
      [step]="5"
    />
    <!-- preview -->
  `,
})
export class SliderMinMaxStepDemo {}
