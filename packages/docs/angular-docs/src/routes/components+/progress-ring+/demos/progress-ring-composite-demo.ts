import {Component} from "@angular/core"

import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"

@Component({
  imports: [ProgressRingModule],
  selector: "progress-ring-composite-demo",
  template: `
    <!-- preview -->
    <div q-progress-ring-root>
      <div q-progress-ring-circle-container>
        <svg q-progress-ring-circle></svg>
      </div>
      <div q-progress-ring-label>Loading...</div>
    </div>
    <!-- preview -->
  `,
})
export class ProgressRingCompositeDemo {}
