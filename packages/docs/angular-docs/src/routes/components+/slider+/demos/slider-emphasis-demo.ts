import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-emphasis-demo",
  template: `
    <!-- preview -->
    <q-slider class="sm:w-80" emphasis="neutral" [defaultValue]="[50]" />
    <!-- preview -->
  `,
})
export class SliderEmphasisDemo {}
