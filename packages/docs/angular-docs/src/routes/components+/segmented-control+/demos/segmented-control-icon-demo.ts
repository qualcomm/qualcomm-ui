import {Component} from "@angular/core"
import {LucideChartArea, LucideMap, LucideTable} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  providers: [provideIcons({LucideChartArea, LucideMap, LucideTable})],
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
