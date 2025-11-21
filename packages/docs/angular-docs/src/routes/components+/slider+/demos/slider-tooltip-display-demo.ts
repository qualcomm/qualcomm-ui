import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-tooltip-display-demo",
  template: `
    <div class="mt-3 sm:w-80" q-slider-root [defaultValue]="[25, 65]">
      <div q-slider-control>
        <div q-slider-track>
          <div q-slider-range></div>
        </div>
        <div q-slider-thumb [index]="0">
          <input q-slider-hidden-input />
          <div q-slider-thumb-indicator [display]="displayFromTooltip"></div>
        </div>
        <div q-slider-thumb [index]="1">
          <input q-slider-hidden-input />
          <div q-slider-thumb-indicator [display]="displayToTooltip"></div>
        </div>
      </div>
      <q-slider-markers />
    </div>
  `,
})
export class SliderTooltipDisplayDemo {
  displayFromTooltip = (value: number) => `From ${value}%`
  displayToTooltip = (value: number) => `To ${value}%`
}
