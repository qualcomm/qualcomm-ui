import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"
import type {QdsSegmentedControlLayout} from "@qualcomm-ui/qds-core/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  selector: "segmented-control-layout-demo",
  template: `
    <div class="flex w-full flex-col gap-4">
      <!-- preview -->
      @for (layout of layouts; track layout) {
        <fieldset
          q-segmented-control
          [defaultValue]="['chart']"
          [layout]="layout"
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
export class SegmentedControlLayoutDemo {
  protected layouts: QdsSegmentedControlLayout[] = ["hug", "fill"]
}
