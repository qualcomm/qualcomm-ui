import {Component} from "@angular/core"

import {ButtonEmphasisDemo} from "@qualcomm-ui/angular-docs/components/button/demos/button-emphasis-demo"
import {ButtonSizesDemo} from "@qualcomm-ui/angular-docs/components/button/demos/button-sizes-demo"
import {ButtonStylesDemo} from "@qualcomm-ui/angular-docs/components/button/demos/button-styles-demo"
import {ButtonVariantsDemo} from "@qualcomm-ui/angular-docs/components/button/demos/button-variants-demo"

@Component({
  imports: [ButtonEmphasisDemo, ButtonSizesDemo, ButtonStylesDemo, ButtonVariantsDemo],
  selector: "app-button",
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
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <button-emphasis-demo />
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
