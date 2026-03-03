import {Component} from "@angular/core"

import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"

@Component({
  imports: [ProgressRingModule],
  selector: "progress-ring-disabled-demo",
  template: `
    <div class="flex gap-8">
      <!-- preview -->
      <div disabled label="Indeterminate" q-progress-ring size="lg"></div>
      <div
        disabled
        label="Determinate"
        q-progress-ring
        size="lg"
        value="64"
        valueText="64%"
      ></div>
      <!-- preview -->
    </div>
  `,
})
export class ProgressRingDisabledDemo {}
