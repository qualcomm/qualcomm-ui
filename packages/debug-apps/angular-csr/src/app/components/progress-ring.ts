import {Component} from "@angular/core"

import {ProgressRingChildDirectivesDemo} from "@qualcomm-ui/angular-docs/components+/progress-ring+/demos/progress-ring-child-directives-demo"
import {ProgressRingCompositeDemo} from "@qualcomm-ui/angular-docs/components+/progress-ring+/demos/progress-ring-composite-demo"
import {ProgressRingSimpleDemo} from "@qualcomm-ui/angular-docs/components+/progress-ring+/demos/progress-ring-simple-demo"
import {ProgressRingSizesDemo} from "@qualcomm-ui/angular-docs/components+/progress-ring+/demos/progress-ring-sizes-demo"
import {ProgressRingThicknessDemo} from "@qualcomm-ui/angular-docs/components+/progress-ring+/demos/progress-ring-thickness-demo"
import {ProgressRingValueDemo} from "@qualcomm-ui/angular-docs/components+/progress-ring+/demos/progress-ring-value-demo"
import {ProgressRingValueTextDemo} from "@qualcomm-ui/angular-docs/components+/progress-ring+/demos/progress-ring-value-text-demo"

@Component({
  imports: [
    ProgressRingChildDirectivesDemo,
    ProgressRingCompositeDemo,
    ProgressRingSimpleDemo,
    ProgressRingSizesDemo,
    ProgressRingThicknessDemo,
    ProgressRingValueDemo,
    ProgressRingValueTextDemo,
  ],
  selector: "app-progress-ring",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Child Directives</h2>
        <div class="demo-container">
          <progress-ring-child-directives-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <progress-ring-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <progress-ring-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <progress-ring-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Thickness</h2>
        <div class="demo-container">
          <progress-ring-thickness-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Value</h2>
        <div class="demo-container">
          <progress-ring-value-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Value Text</h2>
        <div class="demo-container">
          <progress-ring-value-text-demo />
        </div>
      </div>
    </div>
  `,
})
export class ProgressRingPage {}
