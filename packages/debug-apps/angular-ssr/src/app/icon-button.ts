import {Component} from "@angular/core"

import {IconButtonContrastDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-contrast-demo"
import {IconButtonEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-emphasis-demo"
import {IconButtonSizesDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-sizes-demo"
import {IconButtonVariantCombinationsDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-variant-combinations-demo"
import {IconButtonVariantsDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-variants-demo"

@Component({
  imports: [
    IconButtonContrastDemo,
    IconButtonEmphasisDemo,
    IconButtonSizesDemo,
    IconButtonVariantCombinationsDemo,
    IconButtonVariantsDemo,
  ],
  selector: "app-icon-button",
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
        <h2 class="section-title">Contrast</h2>
        <div class="demo-container">
          <icon-button-contrast-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <icon-button-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <icon-button-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variant Combinations</h2>
        <div class="demo-container">
          <icon-button-variant-combinations-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variants</h2>
        <div class="demo-container">
          <icon-button-variants-demo />
        </div>
      </div>
    </div>
  `,
})
export class IconButtonPage {}
