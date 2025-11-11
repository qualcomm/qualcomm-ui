import {Component} from "@angular/core"

import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"

@Component({
  imports: [ProgressRingModule],
  selector: "progress-ring-thickness-demo",
  template: `
    <!-- preview -->
    <div class="py-2" q-progress-ring size="lg" [thickness]="8"></div>
    <!-- preview -->
  `,
})
export class ProgressRingThicknessDemo {}
