import {Component} from "@angular/core"

import {ProgressModule} from "@qualcomm-ui/angular/progress"

@Component({
  imports: [ProgressModule],
  selector: "progress-disabled-demo",
  template: `
    <div class="flex flex-col gap-6">
      <!-- preview -->
      <div class="w-64" disabled label="Indeterminate" q-progress></div>
      <div
        class="w-64"
        disabled
        label="Determinate"
        q-progress
        value="64"
        valueText="64%"
      ></div>
      <!-- preview -->
    </div>
  `,
})
export class ProgressDisabledDemo {}
