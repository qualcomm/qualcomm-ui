import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-tooltip-demo",
  template: `
    <!-- preview -->
    <q-slider class="sm:w-80" tooltip [defaultValue]="[25]" />
    <!-- preview -->
  `,
})
export class SliderTooltipDemo {}
