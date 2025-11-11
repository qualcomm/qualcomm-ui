import {Component} from "@angular/core"

import {ProgressModule} from "@qualcomm-ui/angular/progress"

@Component({
  imports: [ProgressModule],
  selector: "progress-composite-demo",
  template: `
    <!-- preview -->
    <div class="w-64" q-progress-root value="64">
      <div q-progress-label>Label</div>
      <div *progressContext="let context" q-progress-value-text>
        <div q-progress-value-text>{{ context.valuePercent }}%</div>
      </div>
      <div q-progress-track></div>
      <div q-progress-error-text></div>
      <div q-progress-hint>Optional hint</div>
    </div>
    <!-- preview -->
  `,
})
export class ProgressCompositeDemo {}
