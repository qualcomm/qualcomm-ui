import {Component} from "@angular/core"

import {IconButtonContrastDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-contrast-demo"
import {IconButtonDensityDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-density-demo"
import {IconButtonEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-emphasis-demo"
import {IconButtonInverseDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-inverse-demo"
import {IconButtonSizesDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-sizes-demo"
import {IconButtonVariantCombinationsDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-variant-combinations-demo"
import {IconButtonVariantsDemo} from "@qualcomm-ui/angular-docs/components+/icon-button+/demos/icon-button-variants-demo"

@Component({
  imports: [
    IconButtonContrastDemo,
    IconButtonDensityDemo,
    IconButtonEmphasisDemo,
    IconButtonInverseDemo,
    IconButtonSizesDemo,
    IconButtonVariantCombinationsDemo,
    IconButtonVariantsDemo,
  ],
  selector: "app-icon-button",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Contrast</h2>
        <div class="demo-container">
          <icon-button-contrast-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Density</h2>
        <div class="demo-container">
          <icon-button-density-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <icon-button-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Inverse</h2>
        <div class="demo-container">
          <icon-button-inverse-demo />
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
