import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-display-demo",
  template: `
    <!-- preview -->
    <q-slider class="sm:w-80" [defaultValue]="[20, 50]" [display]="display" />
    <!-- preview -->
  `,
})
export class SliderDisplayDemo {
  display(values: number[]): string {
    return `from ${values[0]} to ${values[1]}`
  }
}
