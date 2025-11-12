import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"
import type {FocusChangeDetails} from "@qualcomm-ui/core/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-focus-callback-demo",
  template: `
    <!-- preview -->
    <div class="sm:w-80">
      <q-slider
        [defaultValue]="[25, 75]"
        (focusChanged)="onFocusChange($event)"
      />
      <output class="mt-4 block">
        currently focused:
        <strong>{{ currentOutput }}</strong>
      </output>
    </div>
    <!-- preview -->
  `,
})
export class SliderFocusCallbackDemo {
  currentOutput = "none"

  onFocusChange(e: FocusChangeDetails) {
    this.currentOutput =
      e.focusedIndex === -1 ? "none" : `thumb ${e.focusedIndex}`
  }
}
