import {Component} from "@angular/core"

import {ProgressModule} from "@qualcomm-ui/angular/progress"

@Component({
  imports: [ProgressModule],
  selector: "progress-emphasis-demo",
  template: `
    <div class="flex w-64 flex-col gap-6">
      <!-- preview -->
      <div emphasis="primary" q-progress></div>
      <div emphasis="neutral" q-progress></div>
      <!-- preview -->
    </div>
  `,
})
export class ProgressEmphasisDemo {}
