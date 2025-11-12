import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-size-demo",
  template: `
    <!-- preview -->
    <q-slider class="sm:w-80" size="sm" [defaultValue]="[50]" />
    <!-- preview -->
  `,
})
export class SliderSizeDemo {}
