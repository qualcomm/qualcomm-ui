import {Component} from "@angular/core"

import {ProgressChildDirectivesDemo} from "@qualcomm-ui/angular-docs/components+/progress+/demos/progress-child-directives-demo"
import {ProgressCompositeDemo} from "@qualcomm-ui/angular-docs/components+/progress+/demos/progress-composite-demo"
import {ProgressEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/progress+/demos/progress-emphasis-demo"
import {ProgressErrorTextDemo} from "@qualcomm-ui/angular-docs/components+/progress+/demos/progress-error-text-demo"
import {ProgressLabelOrientationDemo} from "@qualcomm-ui/angular-docs/components+/progress+/demos/progress-label-orientation-demo"
import {ProgressSimpleDemo} from "@qualcomm-ui/angular-docs/components+/progress+/demos/progress-simple-demo"
import {ProgressSizeDemo} from "@qualcomm-ui/angular-docs/components+/progress+/demos/progress-size-demo"

@Component({
  imports: [
    ProgressChildDirectivesDemo,
    ProgressCompositeDemo,
    ProgressEmphasisDemo,
    ProgressErrorTextDemo,
    ProgressLabelOrientationDemo,
    ProgressSimpleDemo,
    ProgressSizeDemo,
  ],
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Child Directives</h2>
        <div class="demo-container">
          <progress-child-directives-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <progress-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <progress-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Error Text</h2>
        <div class="demo-container">
          <progress-error-text-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Label Orientation</h2>
        <div class="demo-container">
          <progress-label-orientation-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <progress-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <progress-size-demo />
        </div>
      </div>
    </div>
  `,
})
export class ProgressPage {}
