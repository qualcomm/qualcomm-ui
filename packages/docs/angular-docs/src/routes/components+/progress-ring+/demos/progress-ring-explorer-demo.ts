import {Component} from "@angular/core"

import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"

@Component({
  imports: [ProgressRingModule],
  selector: "progress-ring-explorer-demo",
  template: `
    <div label="Uploading" q-progress-ring size="lg" value="64">
      <div *progressRingContext="let context" q-progress-ring-value-text>
        {{ context.valuePercent }}%
      </div>
    </div>
  `,
})
export class ProgressRingExplorerDemo {}
