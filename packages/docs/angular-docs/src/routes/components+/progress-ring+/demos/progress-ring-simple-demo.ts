import {Component} from "@angular/core"

import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"

@Component({
  imports: [ProgressRingModule],
  selector: "progress-ring-simple-demo",
  template: `
    <!-- preview -->
    <div label="Label" q-progress-ring></div>
    <!-- preview -->
  `,
})
export class ProgressRingSimpleDemo {}
