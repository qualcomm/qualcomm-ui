import {Component} from "@angular/core"

import {BreadcrumbsDisabledDemo} from "@qualcomm-ui/angular-docs/components+/breadcrumbs+/demos/breadcrumbs-disabled-demo"
import {BreadcrumbsEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/breadcrumbs+/demos/breadcrumbs-emphasis-demo"
import {BreadcrumbsLinksDemo} from "@qualcomm-ui/angular-docs/components+/breadcrumbs+/demos/breadcrumbs-links-demo"
import {BreadcrumbsSizesDemo} from "@qualcomm-ui/angular-docs/components+/breadcrumbs+/demos/breadcrumbs-sizes-demo"

@Component({
  imports: [
    BreadcrumbsDisabledDemo,
    BreadcrumbsEmphasisDemo,
    BreadcrumbsLinksDemo,
    BreadcrumbsSizesDemo,
  ],
  selector: "app-breadcrumbs",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <breadcrumbs-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <breadcrumbs-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Links</h2>
        <div class="demo-container">
          <breadcrumbs-links-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <breadcrumbs-sizes-demo />
        </div>
      </div>
    </div>
  `,
})
export class BreadcrumbsPage {}
