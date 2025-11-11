import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"
import type {QdsSegmentedControlVariant} from "@qualcomm-ui/qds-core/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  selector: "segmented-control-variant-demo",
  template: `
    <div class="flex w-full flex-col items-center gap-4">
      <!-- preview -->
      @for (variant of variants; track variant) {
        <fieldset
          q-segmented-control
          [defaultValue]="['chart']"
          [variant]="variant"
        >
          <label q-segmented-control-item text="Chart" value="chart"></label>
          <label q-segmented-control-item text="Table" value="table"></label>
          <label q-segmented-control-item text="Map" value="map"></label>
        </fieldset>
      }
      <!-- preview -->
    </div>
  `,
})
export class SegmentedControlVariantDemo {
  protected variants: QdsSegmentedControlVariant[] = ["primary", "neutral"]
}
