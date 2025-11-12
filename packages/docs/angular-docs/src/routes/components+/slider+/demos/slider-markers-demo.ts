import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-markers-demo",
  template: `
    <!-- preview -->
    <q-slider
      class="sm:w-80"
      [defaultValue]="[30]"
      [marks]="[20, 30, 40, 50, 60, 70]"
      [max]="70"
      [min]="20"
    />
    <!-- preview -->
  `,
})
export class SliderMarkersDemo {}
