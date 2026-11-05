import {Component} from "@angular/core"

import {TagControlledDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-controlled-demo"
import {TagEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-emphasis-demo"
import {TagIconsDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-icons-demo"
import {TagShapeDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-shape-demo"
import {TagSizesDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-sizes-demo"
import {TagStatesDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-states-demo"
import {TagVariantsDemo} from "@qualcomm-ui/angular-docs/components+/tag+/demos/tag-variants-demo"

@Component({
  imports: [
    TagControlledDemo,
    TagEmphasisDemo,
    TagIconsDemo,
    TagShapeDemo,
    TagSizesDemo,
    TagStatesDemo,
    TagVariantsDemo,
  ],
  selector: "app-tag",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Controlled</h2>
        <div class="demo-container">
          <tag-controlled-demo />
        </div>
      </div>
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
        <h2 class="section-title">Shape</h2>
        <div class="demo-container">
          <tag-shape-demo />
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
