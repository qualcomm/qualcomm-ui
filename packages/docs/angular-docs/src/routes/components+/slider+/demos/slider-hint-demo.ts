import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-hint-demo",
  template: `
    <!-- preview -->
    <q-slider class="sm:w-80" hint="Additional context" [defaultValue]="[50]" />
    <!-- preview -->
  `,
})
export class SliderHintDemo {}
