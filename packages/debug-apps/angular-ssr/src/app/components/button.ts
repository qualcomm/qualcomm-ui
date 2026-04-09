import {Component, ViewEncapsulation} from "@angular/core"

import {ButtonContrastDemo} from "@qualcomm-ui/angular-docs/components+/button+/demos/button-contrast-demo"
import {ButtonDensityDemo} from "@qualcomm-ui/angular-docs/components+/button+/demos/button-density-demo"
import {ButtonEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/button+/demos/button-emphasis-demo"
import {ButtonInverseDemo} from "@qualcomm-ui/angular-docs/components+/button+/demos/button-inverse-demo"
import {ButtonSizesDemo} from "@qualcomm-ui/angular-docs/components+/button+/demos/button-sizes-demo"
import {ButtonStylesDemo} from "@qualcomm-ui/angular-docs/components+/button+/demos/button-styles-demo"
import {ButtonVariantsDemo} from "@qualcomm-ui/angular-docs/components+/button+/demos/button-variants-demo"

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonContrastDemo,
    ButtonDensityDemo,
    ButtonEmphasisDemo,
    ButtonInverseDemo,
    ButtonSizesDemo,
    ButtonStylesDemo,
    ButtonVariantsDemo,
  ],
  selector: "app-button",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Contrast</h2>
        <div class="demo-container">
          <button-contrast-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Density</h2>
        <div class="demo-container">
          <button-density-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <button-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Inverse</h2>
        <div class="demo-container">
          <button-inverse-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <button-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Styles</h2>
        <div class="demo-container">
          <button-styles-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variants</h2>
        <div class="demo-container">
          <button-variants-demo />
        </div>
      </div>
    </div>
  `,
})
export class ButtonPage {}
