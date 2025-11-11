import {Component} from "@angular/core"

import {ProgressModule} from "@qualcomm-ui/angular/progress"

@Component({
  imports: [ProgressModule],
  selector: "progress-label-orientation-demo",
  template: `
    <!-- preview -->
    <div
      class="w-96"
      label="Label"
      labelOrientation="side"
      q-progress
      value="64"
      valueText="64%"
    ></div>
    <!-- preview -->
  `,
})
export class ProgressLabelOrientationDemo {}
