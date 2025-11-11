import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  selector: "segmented-control-composite-demo",
  template: `
    <!-- preview -->
    <fieldset q-segmented-control [defaultValue]="['chart']">
      <label q-segmented-control-item-root value="chart">
        <span q-segmented-control-item-text>Chart</span>
        <input q-segmented-control-hidden-input />
      </label>
      <label q-segmented-control-item-root value="table">
        <span q-segmented-control-item-text>Table</span>
        <input q-segmented-control-hidden-input />
      </label>
      <label q-segmented-control-item-root value="map">
        <span q-segmented-control-item-text>Map</span>
        <input q-segmented-control-hidden-input />
      </label>
    </fieldset>
    <!-- preview -->
  `,
})
export class SegmentedControlCompositeDemo {}
