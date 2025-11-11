import {Component} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  selector: "segmented-control-multiple-demo",
  template: `
    <!-- preview -->
    <fieldset multiple q-segmented-control>
      <label q-segmented-control-item text="Production" value="prod"></label>
      <label q-segmented-control-item text="Staging" value="stag"></label>
      <label q-segmented-control-item text="Development" value="dev"></label>
      <label q-segmented-control-item text="QA" value="qa"></label>
    </fieldset>
    <!-- preview -->
  `,
})
export class SegmentedControlMultipleDemo {}
