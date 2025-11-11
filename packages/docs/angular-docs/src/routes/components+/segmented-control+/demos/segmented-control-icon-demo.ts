import {Component} from "@angular/core"
import {ChartArea, Map, Table} from "lucide-angular"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [SegmentedControlModule],
  providers: [provideIcons({ChartArea, Map, Table})],
  selector: "segmented-control-icon-demo",
  template: `
    <!-- preview -->
    <fieldset q-segmented-control [defaultValue]="['chart']">
      <label
        icon="ChartArea"
        q-segmented-control-item
        text="Chart"
        value="chart"
      ></label>
      <label
        icon="Table"
        q-segmented-control-item
        text="Table"
        value="table"
      ></label>
      <label icon="Map" q-segmented-control-item text="Map" value="map"></label>
    </fieldset>
    <!-- preview -->
  `,
})
export class SegmentedControlIconDemo {}
