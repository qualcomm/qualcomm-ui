import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-origin-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <q-slider
        class="sm:w-80"
        label="Start (default)"
        origin="start"
        [defaultValue]="[50]"
      />
      <q-slider
        class="sm:w-80"
        label="Center"
        origin="center"
        [defaultValue]="[50]"
      />
      <q-slider
        class="sm:w-80"
        label="End"
        origin="end"
        [defaultValue]="[50]"
      />
      <!-- preview -->
    </div>
  `,
})
export class SliderOriginDemo {}
