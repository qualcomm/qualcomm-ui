import {Component} from "@angular/core"

import {DialogAlertDialogDemo} from "@qualcomm-ui/angular-docs/components+/dialog+/demos/dialog-alert-dialog-demo"
import {DialogControlledStateDemo} from "@qualcomm-ui/angular-docs/components+/dialog+/demos/dialog-controlled-state-demo"
import {DialogEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/dialog+/demos/dialog-emphasis-demo"
import {DialogIndicatorIconDemo} from "@qualcomm-ui/angular-docs/components+/dialog+/demos/dialog-indicator-icon-demo"
import {DialogInsideScrollDemo} from "@qualcomm-ui/angular-docs/components+/dialog+/demos/dialog-inside-scroll-demo"
import {DialogOutsideScrollDemo} from "@qualcomm-ui/angular-docs/components+/dialog+/demos/dialog-outside-scroll-demo"
import {DialogPlacementDemo} from "@qualcomm-ui/angular-docs/components+/dialog+/demos/dialog-placement-demo"
import {DialogSizesDemo} from "@qualcomm-ui/angular-docs/components+/dialog+/demos/dialog-sizes-demo"

@Component({
  imports: [
    DialogAlertDialogDemo,
    DialogControlledStateDemo,
    DialogEmphasisDemo,
    DialogIndicatorIconDemo,
    DialogInsideScrollDemo,
    DialogOutsideScrollDemo,
    DialogPlacementDemo,
    DialogSizesDemo,
  ],
  selector: "app-dialog",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Alert Dialog</h2>
        <div class="demo-container">
          <dialog-alert-dialog-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled State</h2>
        <div class="demo-container">
          <dialog-controlled-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <dialog-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Indicator Icon</h2>
        <div class="demo-container">
          <dialog-indicator-icon-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Inside Scroll</h2>
        <div class="demo-container">
          <dialog-inside-scroll-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Outside Scroll</h2>
        <div class="demo-container">
          <dialog-outside-scroll-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Placement</h2>
        <div class="demo-container">
          <dialog-placement-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <dialog-sizes-demo />
        </div>
      </div>
    </div>
  `,
})
export class DialogPage {}
