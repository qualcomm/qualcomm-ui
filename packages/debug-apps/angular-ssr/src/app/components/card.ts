import {Component} from "@angular/core"

import {CardActionsDemo} from "@qualcomm-ui/angular-docs/components+/card+/demos/card-actions-demo"
import {CardAlignmentDemo} from "@qualcomm-ui/angular-docs/components+/card+/demos/card-alignment-demo"
import {CardBadgeDemo} from "@qualcomm-ui/angular-docs/components+/card+/demos/card-badge-demo"
import {CardExplorerDemo} from "@qualcomm-ui/angular-docs/components+/card+/demos/card-explorer-demo"
import {CardInteractiveDemo} from "@qualcomm-ui/angular-docs/components+/card+/demos/card-interactive-demo"
import {CardMediaDemo} from "@qualcomm-ui/angular-docs/components+/card+/demos/card-media-demo"
import {CardShowcaseDemo} from "@qualcomm-ui/angular-docs/components+/card+/demos/card-showcase-demo"
import {CardSizesDemo} from "@qualcomm-ui/angular-docs/components+/card+/demos/card-sizes-demo"
import {CardVariantsDemo} from "@qualcomm-ui/angular-docs/components+/card+/demos/card-variants-demo"

@Component({
  imports: [
    CardActionsDemo,
    CardAlignmentDemo,
    CardBadgeDemo,
    CardExplorerDemo,
    CardInteractiveDemo,
    CardMediaDemo,
    CardShowcaseDemo,
    CardSizesDemo,
    CardVariantsDemo,
  ],
  selector: "app-card",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Actions</h2>
        <div class="demo-container">
          <card-actions-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Alignment</h2>
        <div class="demo-container">
          <card-alignment-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Badge</h2>
        <div class="demo-container">
          <card-badge-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Explorer</h2>
        <div class="demo-container">
          <card-explorer-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Interactive</h2>
        <div class="demo-container">
          <card-interactive-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Media</h2>
        <div class="demo-container">
          <card-media-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Showcase</h2>
        <div class="demo-container">
          <card-showcase-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <card-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variants</h2>
        <div class="demo-container">
          <card-variants-demo />
        </div>
      </div>
    </div>
  `,
})
export class CardPage {}

