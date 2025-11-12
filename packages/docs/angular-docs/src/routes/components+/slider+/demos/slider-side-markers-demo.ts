import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-side-markers-demo",
  template: `
    <!-- preview -->
    <q-slider
      class="sm:w-80"
      sideMarkers
      [defaultValue]="[30]"
      [max]="70"
      [min]="20"
    />
    <!-- preview -->
  `,
})
export class SliderSideMarkersDemo {}
