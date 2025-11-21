import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-tooltip-demo",
  template: `
    <!-- preview -->
    <q-slider class="mt-3 sm:w-80" tooltip [defaultValue]="[25]" />
    <!-- preview -->
  `,
})
export class SliderTooltipDemo {}
