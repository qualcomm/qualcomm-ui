import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-min-steps-demo",
  template: `
    <!-- preview -->
    <q-slider
      class="sm:w-80"
      [defaultValue]="[20, 50]"
      [minStepsBetweenThumbs]="10"
    />
    <!-- preview -->
  `,
})
export class SliderMinStepsDemo {}
