import {Component} from "@angular/core"

import {PasswordInputChildDirectivesDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-child-directives-demo"
import {PasswordInputCompositeDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-composite-demo"
import {PasswordInputControlledVisibilityDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-controlled-visibility-demo"
import {PasswordInputErrorTextDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-error-text-demo"
import {PasswordInputReactiveFormStatesDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-reactive-form-states-demo"
import {PasswordInputReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-reactive-forms-demo"
import {PasswordInputRequiredTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-required-template-forms-demo"
import {PasswordInputSimpleDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-simple-demo"
import {PasswordInputSimpleIconsDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-simple-icons-demo"
import {PasswordInputTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/password-input+/demos/password-input-template-forms-demo"

@Component({
  imports: [
    PasswordInputChildDirectivesDemo,
    PasswordInputCompositeDemo,
    PasswordInputControlledVisibilityDemo,
    PasswordInputErrorTextDemo,
    PasswordInputReactiveFormStatesDemo,
    PasswordInputReactiveFormsDemo,
    PasswordInputRequiredTemplateFormsDemo,
    PasswordInputSimpleDemo,
    PasswordInputSimpleIconsDemo,
    PasswordInputTemplateFormsDemo,
  ],
  selector: "app-password-input",
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
          <password-input-child-directives-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <password-input-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled Visibility</h2>
        <div class="demo-container">
          <password-input-controlled-visibility-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Error Text</h2>
        <div class="demo-container">
          <password-input-error-text-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Form States</h2>
        <div class="demo-container">
          <password-input-reactive-form-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Forms</h2>
        <div class="demo-container">
          <password-input-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Required Template Forms</h2>
        <div class="demo-container">
          <password-input-required-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <password-input-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple Icons</h2>
        <div class="demo-container">
          <password-input-simple-icons-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Forms</h2>
        <div class="demo-container">
          <password-input-template-forms-demo />
        </div>
      </div>
    </div>
  `,
})
export class PasswordInputPage {}
