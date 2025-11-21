import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-composite-demo",
  template: `
    <!-- preview -->
    <div class="sm:w-80" q-slider-root [defaultValue]="[25]">
      <label q-slider-label>Choose a value</label>
      <div q-slider-value-text></div>
      <div q-slider-control>
        <div q-slider-track>
          <div q-slider-range></div>
        </div>
        <div q-slider-thumb [index]="0">
          <input q-slider-hidden-input />
        </div>
      </div>
      <div q-slider-marker-group>
        @for (value of markers; track value) {
          <span q-slider-marker [value]="value">{{ value }}</span>
        }
      </div>
      <span q-slider-hint>Some contextual help here</span>
    </div>
    <!-- preview -->
  `,
})
export class SliderCompositeDemo {
  markers = Array.from({length: 11}, (_, i) => i * 10)
}
