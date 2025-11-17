import {Component} from "@angular/core"

import {SwitchAdvancedValidationDemo} from "@qualcomm-ui/angular-docs/components+/switch+/demos/switch-advanced-validation-demo"
import {SwitchChildDirectivesDemo} from "@qualcomm-ui/angular-docs/components+/switch+/demos/switch-child-directives-demo"
import {SwitchCompositeDemo} from "@qualcomm-ui/angular-docs/components+/switch+/demos/switch-composite-demo"
import {SwitchDisabledDemo} from "@qualcomm-ui/angular-docs/components+/switch+/demos/switch-disabled-demo"
import {SwitchReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/switch+/demos/switch-reactive-forms-demo"
import {SwitchSimpleDemo} from "@qualcomm-ui/angular-docs/components+/switch+/demos/switch-simple-demo"
import {SwitchStatesDemo} from "@qualcomm-ui/angular-docs/components+/switch+/demos/switch-states-demo"
import {SwitchTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/switch+/demos/switch-template-forms-demo"

@Component({
  imports: [
    SwitchAdvancedValidationDemo,
    SwitchChildDirectivesDemo,
    SwitchCompositeDemo,
    SwitchDisabledDemo,
    SwitchReactiveFormsDemo,
    SwitchSimpleDemo,
    SwitchStatesDemo,
    SwitchTemplateFormsDemo,
  ],
  selector: "app-switch",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Advanced Validation</h2>
        <div class="demo-container">
          <switch-advanced-validation-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Child Directives</h2>
        <div class="demo-container">
          <switch-child-directives-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <switch-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <switch-disabled />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Forms</h2>
        <div class="demo-container">
          <switch-reactive-forms />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <simple-switch-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <switch-states />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Forms</h2>
        <div class="demo-container">
          <switch-template-forms />
        </div>
      </div>
    </div>
  `,
})
export class SwitchPage {}
