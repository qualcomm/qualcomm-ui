import {Component} from "@angular/core"

import {CheckboxAdvancedValidationDemo} from "@qualcomm-ui/angular-docs/components+/checkbox+/demos/checkbox-advanced-validation-demo"
import {CheckboxCompositeDemo} from "@qualcomm-ui/angular-docs/components+/checkbox+/demos/checkbox-composite-demo"
import {CheckboxDisabledDemo} from "@qualcomm-ui/angular-docs/components+/checkbox+/demos/checkbox-disabled-demo"
import {CheckboxReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/checkbox+/demos/checkbox-reactive-forms-demo"
import {CheckboxSimpleDemo} from "@qualcomm-ui/angular-docs/components+/checkbox+/demos/checkbox-simple-demo"
import {CheckboxSizesDemo} from "@qualcomm-ui/angular-docs/components+/checkbox+/demos/checkbox-sizes-demo"
import {CheckboxStatesDemo} from "@qualcomm-ui/angular-docs/components+/checkbox+/demos/checkbox-states-demo"
import {CheckboxTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/checkbox+/demos/checkbox-template-forms-demo"

@Component({
  imports: [
    CheckboxAdvancedValidationDemo,
    CheckboxCompositeDemo,
    CheckboxDisabledDemo,
    CheckboxReactiveFormsDemo,
    CheckboxSimpleDemo,
    CheckboxSizesDemo,
    CheckboxStatesDemo,
    CheckboxTemplateFormsDemo,
  ],
  selector: "app-checkbox",
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
        <h2 class="section-title">Advanced Validation</h2>
        <div class="demo-container">
          <checkbox-reactive-forms />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <checkbox-showcase />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <checkbox-disabled />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Forms</h2>
        <div class="demo-container">
          <checkbox-reactive-forms />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <simple-checkbox-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <checkbox-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <checkbox-states />
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
export class CheckboxPage {}
