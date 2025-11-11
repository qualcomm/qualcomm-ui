import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"
import type {QdsSegmentedControlSize} from "@qualcomm-ui/qds-core/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  selector: "segmented-control-size-demo",
  template: `
    <div class="flex w-full flex-col items-center gap-4">
      <!-- preview -->
      @for (size of sizes; track size) {
        <fieldset q-segmented-control [defaultValue]="['chart']" [size]="size">
          <label q-segmented-control-item text="Chart" value="chart"></label>
          <label q-segmented-control-item text="Table" value="table"></label>
          <label q-segmented-control-item text="Map" value="map"></label>
        </fieldset>
      }
      <!-- preview -->
    </div>
  `,
})
export class SegmentedControlSizeDemo {
  protected sizes: QdsSegmentedControlSize[] = ["sm", "md", "lg"]
}
