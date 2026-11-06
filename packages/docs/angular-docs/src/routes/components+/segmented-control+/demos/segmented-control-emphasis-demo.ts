import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"
import type {QdsSegmentedControlEmphasis} from "@qualcomm-ui/qds-core/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  selector: "segmented-control-emphasis-demo",
  template: `
    <div class="flex w-full flex-col items-center gap-4">
      <!-- preview -->
      @for (emphasis of emphases; track emphasis) {
        <fieldset
          q-segmented-control
          [defaultValue]="['chart']"
          [emphasis]="emphasis"
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
export class SegmentedControlEmphasisDemo {
  protected emphases: QdsSegmentedControlEmphasis[] = ["brand", "neutral"]
}
