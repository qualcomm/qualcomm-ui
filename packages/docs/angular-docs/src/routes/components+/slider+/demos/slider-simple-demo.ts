import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-simple-demo",
  template: `
    <!-- preview -->
    <q-slider
      class="sm:w-80"
      hint="Some contextual help here"
      label="Choose a value"
      [defaultValue]="[25]"
    />
    <!-- preview -->
  `,
})
export class SliderSimpleDemo {}
