import {Component} from "@angular/core"

import {ProgressModule} from "@qualcomm-ui/angular/progress"

@Component({
  imports: [ProgressModule],
  selector: "progress-child-directives-demo",
  template: `
    <!-- preview -->
    <div class="w-64" q-progress>
      <div q-progress-label>Label</div>
    </div>
    <!-- preview -->
  `,
})
export class ProgressChildDirectivesDemo {}
