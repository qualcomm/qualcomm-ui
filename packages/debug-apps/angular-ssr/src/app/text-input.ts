import {Component} from "@angular/core"

import {TextInputChildDirectivesDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-child-directives-demo"
import {TextInputClearTriggerDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-clear-trigger-demo"
import {TextInputCompositeDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-composite-demo"
import {TextInputCompositeFormsDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-composite-forms-demo"
import {TextInputCompositeIconsDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-composite-icons-demo"
import {TextInputCompositeLayoutDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-composite-layout-demo"
import {TextInputControlledStateDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-controlled-state-demo"
import {TextInputErrorTextDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-error-text-demo"
import {TextInputReactiveFormStatesDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-reactive-form-states-demo"
import {TextInputReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-reactive-forms-demo"
import {TextInputRequiredTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-required-template-forms-demo"
import {TextInputSimpleDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-simple-demo"
import {TextInputSimpleIconsDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-simple-icons-demo"
import {TextInputSizesDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-sizes-demo"
import {TextInputStatesDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-states-demo"
import {TextInputTemplateFormsInvalidDemo} from "@qualcomm-ui/angular-docs/components+/text-input+/demos/text-input-template-forms-invalid-demo"

@Component({
  imports: [
    TextInputChildDirectivesDemo,
    TextInputClearTriggerDemo,
    TextInputCompositeDemo,
    TextInputCompositeFormsDemo,
    TextInputCompositeIconsDemo,
    TextInputCompositeLayoutDemo,
    TextInputControlledStateDemo,
    TextInputErrorTextDemo,
    TextInputReactiveFormStatesDemo,
    TextInputReactiveFormsDemo,
    TextInputRequiredTemplateFormsDemo,
    TextInputSimpleDemo,
    TextInputSimpleIconsDemo,
    TextInputSizesDemo,
    TextInputStatesDemo,
    TextInputTemplateFormsInvalidDemo,
  ],
  selector: "app-text-input",
  styles: `
    .section {
      margin-bottom: 3rem;
    }

    .section-title {
      font: var(--font-static-heading-md-default);
      margin-bottom: 1rem;
      color: var(--color-text-neutral-primary);
    }

    .demo-container {
      padding: 2rem;
      border: 1px solid var(--color-border-neutral-01);
      border-radius: 8px;
      background-color: var(--color-background-neutral-01);
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Child Directives</h2>
        <div class="demo-container">
          <text-input-child-directives-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Clear Trigger</h2>
        <div class="demo-container">
          <text-input-clear-trigger-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <text-input-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite Forms</h2>
        <div class="demo-container">
          <text-input-composite-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite Icons</h2>
        <div class="demo-container">
          <text-input-icons-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite Layout</h2>
        <div class="demo-container">
          <text-input-composite-layout-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled State</h2>
        <div class="demo-container">
          <text-input-controlled-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Error Text</h2>
        <div class="demo-container">
          <text-input-error-text-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Form States</h2>
        <div class="demo-container">
          <text-input-reactive-form-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Forms</h2>
        <div class="demo-container">
          <text-input-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Required Template Forms</h2>
        <div class="demo-container">
          <text-input-required-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <text-input-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple Icons</h2>
        <div class="demo-container">
          <text-input-simple-icons-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <text-input-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <text-input-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Forms Invalid</h2>
        <div class="demo-container">
          <text-input-template-form-invalid-demo />
        </div>
      </div>
    </div>
  `,
})
export class TextInputPage {}
