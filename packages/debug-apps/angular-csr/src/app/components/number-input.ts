import {Component} from "@angular/core"

import {NumberInputChildDirectivesDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-child-directives-demo"
import {NumberInputCompositeDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-composite-demo"
import {NumberInputCompositeFormsDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-composite-forms-demo"
import {NumberInputErrorTextDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-error-text-demo"
import {NumberInputMinMaxDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-min-max-demo"
import {NumberInputReactiveFormStatesDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-reactive-form-states-demo"
import {NumberInputReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-reactive-forms-demo"
import {NumberInputRequiredTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-required-template-forms-demo"
import {NumberInputSimpleDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-simple-demo"
import {NumberInputSizesDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-sizes-demo"
import {NumberInputStatesDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-states-demo"
import {NumberInputStepDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-step-demo"
import {NumberInputTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/number-input+/demos/number-input-template-forms-demo"

@Component({
  imports: [
    NumberInputChildDirectivesDemo,
    NumberInputCompositeDemo,
    NumberInputCompositeFormsDemo,
    NumberInputErrorTextDemo,
    NumberInputMinMaxDemo,
    NumberInputReactiveFormStatesDemo,
    NumberInputReactiveFormsDemo,
    NumberInputRequiredTemplateFormsDemo,
    NumberInputSimpleDemo,
    NumberInputSizesDemo,
    NumberInputStatesDemo,
    NumberInputStepDemo,
    NumberInputTemplateFormsDemo,
  ],
  selector: "app-number-input",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Child Directives</h2>
        <div class="demo-container">
          <number-input-child-directives-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <number-input-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite Forms</h2>
        <div class="demo-container">
          <number-input-composite-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Error Text</h2>
        <div class="demo-container">
          <number-input-error-text-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Min Max</h2>
        <div class="demo-container">
          <number-input-min-max-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Form States</h2>
        <div class="demo-container">
          <number-input-reactive-form-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Forms</h2>
        <div class="demo-container">
          <number-input-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Required Template Forms</h2>
        <div class="demo-container">
          <number-input-required-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <number-input-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <number-input-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <number-input-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Step</h2>
        <div class="demo-container">
          <number-input-step-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Forms</h2>
        <div class="demo-container">
          <number-input-template-forms-demo />
        </div>
      </div>
    </div>
  `,
})
export class NumberInputPage {}
