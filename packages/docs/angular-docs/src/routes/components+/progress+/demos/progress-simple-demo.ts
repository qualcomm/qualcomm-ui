import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {ProgressModule} from "@qualcomm-ui/angular/progress"

@Component({
  imports: [ProgressModule, ButtonModule],
  selector: "progress-simple-demo",
  standalone: true,
  template: `
    <div class="flex flex-col gap-6">
      <!-- preview -->
      <div class="w-64" label="Indeterminate" q-progress></div>
      <div
        hint="Optional hint"
        label="Determinate"
        q-progress
        value="64"
        valueText="64%"
      ></div>
      <!-- preview -->
    </div>
  `,
})
export class ProgressSimpleDemo {}
