import {Component} from "@angular/core"

import {AlertBannerActionDemo} from "@qualcomm-ui/angular-docs/components+/alert-banner+/demos/alert-banner-action-demo"
import {AlertBannerCompositeDemo} from "@qualcomm-ui/angular-docs/components+/alert-banner+/demos/alert-banner-composite-demo"
import {AlertBannerDismissableDemo} from "@qualcomm-ui/angular-docs/components+/alert-banner+/demos/alert-banner-dismissable-demo"
import {AlertBannerEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/alert-banner+/demos/alert-banner-emphasis-demo"
import {AlertBannerExplorerDemo} from "@qualcomm-ui/angular-docs/components+/alert-banner+/demos/alert-banner-explorer-demo"
import {AlertBannerSimpleDemo} from "@qualcomm-ui/angular-docs/components+/alert-banner+/demos/alert-banner-simple-demo"
import {AlertBannerVariantDemo} from "@qualcomm-ui/angular-docs/components+/alert-banner+/demos/alert-banner-variant-demo"

@Component({
  imports: [
    AlertBannerActionDemo,
    AlertBannerCompositeDemo,
    AlertBannerDismissableDemo,
    AlertBannerEmphasisDemo,
    AlertBannerExplorerDemo,
    AlertBannerSimpleDemo,
    AlertBannerVariantDemo,
  ],
  selector: "app-alert-banner",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Action</h2>
        <div class="demo-container">
          <alert-banner-action-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <alert-banner-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Dismissable</h2>
        <div class="demo-container">
          <alert-banner-dismissable-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <alert-banner-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Explorer</h2>
        <div class="demo-container">
          <alert-banner-explorer-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <alert-banner-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variant</h2>
        <div class="demo-container">
          <alert-banner-variant-demo />
        </div>
      </div>
    </div>
  `,
})
export class AlertBannerPage {}

