import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"
import {SliderModule} from "@qualcomm-ui/angular/slider"
import type {QdsSegmentedControlVariant} from "@qualcomm-ui/qds-core/segmented-control"

@Component({
  imports: [SegmentedControlModule, SliderModule],
  selector: "app-settings",
  template: `
    @for (variant of variants; track variant) {
      <fieldset
        q-segmented-control
        [defaultValue]="['chart']"
        [variant]="variant"
      ></fieldset>
    }
    <q-slider variant="primary" />
  `,
})
export class Settings {
  protected variants: QdsSegmentedControlVariant[] = ["primary", "neutral"]
}

@Component({
  imports: [SliderModule],
  selector: "app-volume",
  template: '<div q-slider-root variant="primary"></div>',
})
export class Volume {}
