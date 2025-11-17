import {Component, ViewEncapsulation} from "@angular/core"

import {SliderCompositeDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-composite-demo"
import {SliderDisabledDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-disabled-demo"
import {SliderDisplayDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-display-demo"
import {SliderFocusCallbackDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-focus-callback-demo"
import {SliderHintDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-hint-demo"
import {SliderMarkersDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-markers-demo"
import {SliderMinMaxStepDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-min-max-step-demo"
import {SliderMinStepsDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-min-steps-demo"
import {SliderOriginDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-origin-demo"
import {SliderRangeDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-range-demo"
import {SliderReactiveFormStatesDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-reactive-form-states-demo"
import {SliderSideMarkersDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-side-markers-demo"
import {SliderSimpleDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-simple-demo"
import {SliderSizeDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-size-demo"
import {SliderTemplateFormStateDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-template-form-state-demo"
import {SliderTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-template-forms-demo"
import {SliderTooltipDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-tooltip-demo"
import {SliderValueCallbackDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-value-callback-demo"
import {SliderVariantDemo} from "@qualcomm-ui/angular-docs/components+/slider+/demos/slider-variant-demo"

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    SliderCompositeDemo,
    SliderDisabledDemo,
    SliderDisplayDemo,
    SliderFocusCallbackDemo,
    SliderHintDemo,
    SliderMarkersDemo,
    SliderMinMaxStepDemo,
    SliderMinStepsDemo,
    SliderOriginDemo,
    SliderRangeDemo,
    SliderReactiveFormStatesDemo,
    SliderSideMarkersDemo,
    SliderSimpleDemo,
    SliderSizeDemo,
    SliderTemplateFormStateDemo,
    SliderTemplateFormsDemo,
    SliderTooltipDemo,
    SliderValueCallbackDemo,
    SliderVariantDemo,
  ],
  selector: "app-slider",
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <slider-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variant</h2>
        <div class="demo-container">
          <slider-variant-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <slider-size-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Hint</h2>
        <div class="demo-container">
          <slider-hint-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <slider-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Range</h2>
        <div class="demo-container">
          <slider-range-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Min Max Step</h2>
        <div class="demo-container">
          <slider-min-max-step-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Min Steps</h2>
        <div class="demo-container">
          <slider-min-steps-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Origin</h2>
        <div class="demo-container">
          <slider-origin-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Markers</h2>
        <div class="demo-container">
          <slider-markers-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Side Markers</h2>
        <div class="demo-container">
          <slider-side-markers-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Display</h2>
        <div class="demo-container">
          <slider-display-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Tooltip</h2>
        <div class="demo-container">
          <slider-tooltip-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <slider-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Forms</h2>
        <div class="demo-container">
          <slider-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Form State</h2>
        <div class="demo-container">
          <slider-template-form-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Form States</h2>
        <div class="demo-container">
          <slider-reactive-form-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Value Callback</h2>
        <div class="demo-container">
          <slider-value-callback-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Focus Callback</h2>
        <div class="demo-container">
          <slider-focus-callback-demo />
        </div>
      </div>
    </div>
  `,
})
export class SliderPage {}
