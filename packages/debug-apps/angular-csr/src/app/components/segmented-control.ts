import {Component} from "@angular/core"

import {SegmentedControlCompositeDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-composite-demo"
import {SegmentedControlControlledDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-controlled-demo"
import {SegmentedControlDisabledDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-disabled-demo"
import {SegmentedControlIconDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-icon-demo"
import {SegmentedControlIconOnlyDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-icon-only-demo"
import {SegmentedControlLayoutDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-layout-demo"
import {SegmentedControlMultipleDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-multiple-demo"
import {SegmentedControlOrientationDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-orientation-demo"
import {SegmentedControlSimpleDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-simple-demo"
import {SegmentedControlSizeDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-size-demo"
import {SegmentedControlVariantDemo} from "@qualcomm-ui/angular-docs/components+/segmented-control+/demos/segmented-control-variant-demo"

@Component({
  imports: [
    SegmentedControlCompositeDemo,
    SegmentedControlControlledDemo,
    SegmentedControlDisabledDemo,
    SegmentedControlIconDemo,
    SegmentedControlIconOnlyDemo,
    SegmentedControlLayoutDemo,
    SegmentedControlMultipleDemo,
    SegmentedControlOrientationDemo,
    SegmentedControlSimpleDemo,
    SegmentedControlSizeDemo,
    SegmentedControlVariantDemo,
  ],
  selector: "app-segmented-control",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <segmented-control-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled</h2>
        <div class="demo-container">
          <segmented-control-controlled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <segmented-control-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icon</h2>
        <div class="demo-container">
          <segmented-control-icon-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icon Only</h2>
        <div class="demo-container">
          <segmented-control-icon-only-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Layout</h2>
        <div class="demo-container">
          <segmented-control-layout-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Multiple</h2>
        <div class="demo-container">
          <segmented-control-multiple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Orientation</h2>
        <div class="demo-container">
          <segmented-control-orientation-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <segmented-control-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <segmented-control-size-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variant</h2>
        <div class="demo-container">
          <segmented-control-variant-demo />
        </div>
      </div>
    </div>
  `,
})
export class SegmentedControlPage {}
