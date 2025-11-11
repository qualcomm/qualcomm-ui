import {Component} from "@angular/core"
import {ChartArea, Map, Table} from "lucide-angular"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [SegmentedControlModule],
  providers: [provideIcons({ChartArea, Map, Table})],
  selector: "segmented-control-icon-only-demo",
  template: `
    <!-- preview -->
    <fieldset q-segmented-control [defaultValue]="['chart']">
      <label
        aria-label="Chart view"
        icon="ChartArea"
        q-segmented-control-item
        value="chart"
      ></label>
      <label
        aria-label="Table view"
        icon="Table"
        q-segmented-control-item
        value="table"
      ></label>
      <label
        aria-label="Map view"
        icon="Map"
        q-segmented-control-item
        value="map"
      ></label>
    </fieldset>
    <!-- preview -->
  `,
})
export class SegmentedControlIconOnlyDemo {}
