import {Component} from "@angular/core"

import {TagEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-emphasis-demo"
import {TagIconsDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-icons-demo"
import {TagRadiusDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-radius-demo"
import {TagSizesDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-sizes-demo"
import {TagStatesDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-states-demo"
import {TagVariantsDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-variants-demo"

@Component({
  imports: [
    TagEmphasisDemo,
    TagIconsDemo,
    TagRadiusDemo,
    TagSizesDemo,
    TagStatesDemo,
    TagVariantsDemo,
  ],
  selector: "app-tag",
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <tag-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icons</h2>
        <div class="demo-container">
          <tag-icons-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Radius</h2>
        <div class="demo-container">
          <tag-radius-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <tag-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <tag-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variants</h2>
        <div class="demo-container">
          <tag-variants-demo />
        </div>
      </div>
    </div>
  `,
})
export class TagPage {}
