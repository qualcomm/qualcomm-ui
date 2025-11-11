import {Component} from "@angular/core"

import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"

@Component({
  imports: [ProgressRingModule],
  selector: "progress-ring-child-directives-demo",
  template: `
    <!-- preview -->
    <div q-progress-ring>
      <div q-progress-ring-label>Label</div>
    </div>
    <!-- preview -->
  `,
})
export class ProgressRingChildDirectivesDemo {}
