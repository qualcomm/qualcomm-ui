import {Component} from "@angular/core"

import {ProgressModule} from "@qualcomm-ui/angular/progress"

@Component({
  imports: [ProgressModule],
  selector: "progress-error-text-demo",
  template: `
    <!-- preview -->
    <div
      class="w-64"
      defaultValue="25"
      errorText="Network disconnected, please try again"
      invalid
      label="Loading Module"
      q-progress
    >
      <div *progressContext="let context" q-progress-value-text>
        {{ context.valuePercent }}%
      </div>
    </div>
    <!-- preview -->
  `,
})
export class ProgressErrorTextDemo {}
