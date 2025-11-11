import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  selector: "segmented-control-disabled-demo",
  template: `
    <!-- preview -->
    <fieldset disabled q-segmented-control>
      <label q-segmented-control-item text="Chart" value="chart"></label>
      <label q-segmented-control-item text="Table" value="table"></label>
      <label q-segmented-control-item text="Map" value="map"></label>
    </fieldset>
    <!-- preview -->
  `,
})
export class SegmentedControlDisabledDemo {}
