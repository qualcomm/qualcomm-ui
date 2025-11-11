import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  selector: "segmented-control-orientation-demo",
  template: `
    <!-- preview -->
    <fieldset
      orientation="vertical"
      q-segmented-control
      [defaultValue]="['chart']"
    >
      <label q-segmented-control-item text="Chart" value="chart"></label>
      <label q-segmented-control-item text="Table" value="table"></label>
      <label q-segmented-control-item text="Map" value="map"></label>
    </fieldset>
    <!-- preview -->
  `,
})
export class SegmentedControlOrientationDemo {}
