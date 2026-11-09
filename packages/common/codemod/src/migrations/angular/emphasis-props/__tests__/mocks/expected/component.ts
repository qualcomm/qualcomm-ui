import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"
import {SliderModule} from "@qualcomm-ui/angular/slider"
import type {QdsSegmentedControlEmphasis} from "@qualcomm-ui/qds-core/segmented-control"

@Component({
  imports: [SegmentedControlModule, SliderModule],
  selector: "app-settings",
  template: `
    @for (variant of variants; track variant) {
      <fieldset
        q-segmented-control
        [defaultValue]="['chart']"
        [emphasis]="variant"
      ></fieldset>
    }
    <q-slider emphasis="brand" />
  `,
})
export class Settings {
  protected variants: QdsSegmentedControlEmphasis[] = ["primary", "neutral"]
}

@Component({
  imports: [SliderModule],
  selector: "app-volume",
  template: '<div q-slider-root emphasis="brand"></div>',
})
export class Volume {}
