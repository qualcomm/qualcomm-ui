import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-disabled-demo",
  template: `
    <!-- preview -->
    <q-slider class="sm:w-80" disabled [defaultValue]="[50]" />
    <!-- preview -->
  `,
})
export class SliderDisabledDemo {}
