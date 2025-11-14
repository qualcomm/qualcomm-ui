import {Component} from "@angular/core"

import {DividerFocusableDemo} from "@qualcomm-ui/angular-docs/components/divider/demos/divider-focusable-demo"
import {DividerOrientationDemo} from "@qualcomm-ui/angular-docs/components/divider/demos/divider-orientation-demo"
import {DividerShowcaseDemo} from "@qualcomm-ui/angular-docs/components/divider/demos/divider-showcase-demo"
import {DividerValueTextDemo} from "@qualcomm-ui/angular-docs/components/divider/demos/divider-value-text-demo"
import {DividerVariantsDemo} from "@qualcomm-ui/angular-docs/components/divider/demos/divider-variants-demo"

@Component({
  imports: [DividerFocusableDemo, DividerOrientationDemo, DividerShowcaseDemo, DividerValueTextDemo, DividerVariantsDemo],
  selector: "app-divider",
  styles: `
    .section {
      margin-bottom: 3rem;
    }

    .section-title {
      font: var(--font-static-heading-md-default);
      margin-bottom: 1rem;
      color: var(--color-text-neutral-primary);
    }

    .demo-container {
      padding: 2rem;
      border: 1px solid var(--color-border-neutral-01);
      border-radius: 8px;
      background-color: var(--color-background-neutral-01);
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Focusable</h2>
        <div class="demo-container">
          <divider-focusable-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Orientation</h2>
        <div class="demo-container">
          <divider-orientation-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Showcase</h2>
        <div class="demo-container">
          <divider-showcase-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Value Text</h2>
        <div class="demo-container">
          <divider-value-text-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variants</h2>
        <div class="demo-container">
          <divider-variants-demo />
        </div>
      </div>
    </div>
  `,
})
export class DividerPage {}
