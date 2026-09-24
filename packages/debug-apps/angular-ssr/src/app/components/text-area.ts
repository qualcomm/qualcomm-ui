import {Component} from "@angular/core"

import {TextAreaCompositeDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-composite-demo"
import {TextAreaCompositeFormsDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-composite-forms-demo"
import {TextAreaCounterDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-counter-demo"
import {TextAreaErrorTextDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-error-text-demo"
import {TextAreaExplorerDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-explorer-demo"
import {TextAreaReactiveFormStatesDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-reactive-form-states-demo"
import {TextAreaReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-reactive-forms-demo"
import {TextAreaRequiredTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-required-template-forms-demo"
import {TextAreaSimpleDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-simple-demo"
import {TextAreaSizesDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-sizes-demo"
import {TextAreaStatesDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-states-demo"
import {TextAreaTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-template-forms-demo"
import {TextAreaValueChangedDemo} from "@qualcomm-ui/angular-docs/components+/text-area+/demos/text-area-value-changed-demo"

@Component({
  imports: [
    TextAreaCompositeDemo,
    TextAreaCompositeFormsDemo,
    TextAreaCounterDemo,
    TextAreaErrorTextDemo,
    TextAreaExplorerDemo,
    TextAreaReactiveFormStatesDemo,
    TextAreaReactiveFormsDemo,
    TextAreaRequiredTemplateFormsDemo,
    TextAreaSimpleDemo,
    TextAreaSizesDemo,
    TextAreaStatesDemo,
    TextAreaTemplateFormsDemo,
    TextAreaValueChangedDemo,
  ],
  selector: "app-text-area",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <text-area-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite Forms</h2>
        <div class="demo-container">
          <text-area-composite-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Counter</h2>
        <div class="demo-container">
          <text-area-counter-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Error Text</h2>
        <div class="demo-container">
          <text-area-error-text-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Explorer</h2>
        <div class="demo-container">
          <text-area-explorer-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Form States</h2>
        <div class="demo-container">
          <text-area-reactive-form-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Forms</h2>
        <div class="demo-container">
          <text-area-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Required Template Forms</h2>
        <div class="demo-container">
          <text-area-required-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <text-area-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <text-area-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <text-area-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Forms</h2>
        <div class="demo-container">
          <text-area-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Value Changed</h2>
        <div class="demo-container">
          <text-area-value-changed-demo />
        </div>
      </div>
    </div>
  `,
})
export class TextAreaPage {}

