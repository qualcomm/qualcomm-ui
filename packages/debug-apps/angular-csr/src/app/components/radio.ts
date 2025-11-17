import {Component} from "@angular/core"

import {RadioChildDirectivesDemo} from "@qualcomm-ui/angular-docs/components+/radio+/demos/radio-child-directives-demo"
import {RadioCompositeDemo} from "@qualcomm-ui/angular-docs/components+/radio+/demos/radio-composite-demo"
import {RadioCompositeLayoutDemo} from "@qualcomm-ui/angular-docs/components+/radio+/demos/radio-composite-layout-demo"
import {RadioDisabledDemo} from "@qualcomm-ui/angular-docs/components+/radio+/demos/radio-disabled-demo"
import {RadioOrientationDemo} from "@qualcomm-ui/angular-docs/components+/radio+/demos/radio-orientation-demo"
import {RadioReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/radio+/demos/radio-reactive-forms-demo"
import {RadioSimpleDemo} from "@qualcomm-ui/angular-docs/components+/radio+/demos/radio-simple-demo"
import {RadioSizesDemo} from "@qualcomm-ui/angular-docs/components+/radio+/demos/radio-sizes-demo"
import {RadioTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/radio+/demos/radio-template-forms-demo"

@Component({
  imports: [
    RadioChildDirectivesDemo,
    RadioCompositeDemo,
    RadioCompositeLayoutDemo,
    RadioDisabledDemo,
    RadioOrientationDemo,
    RadioReactiveFormsDemo,
    RadioSimpleDemo,
    RadioSizesDemo,
    RadioTemplateFormsDemo,
  ],
  selector: "app-radio",
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Child Directives</h2>
        <div class="demo-container">
          <radio-child-directives-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <radio-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite Layout</h2>
        <div class="demo-container">
          <radio-composite-layout-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <radio-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Orientation</h2>
        <div class="demo-container">
          <radio-orientation-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Forms</h2>
        <div class="demo-container">
          <radio-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <radio-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <radio-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Forms</h2>
        <div class="demo-container">
          <checkbox-template-forms />
        </div>
      </div>
    </div>
  `,
})
export class RadioPage {}
