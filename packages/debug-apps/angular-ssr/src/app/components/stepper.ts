import {Component} from "@angular/core"

import {StepperCompletedDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-completed-demo"
import {StepperControlledDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-controlled-demo"
import {StepperHintDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-hint-demo"
import {StepperHorizontalBottomStartDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-horizontal-bottom-start-demo"
import {StepperHorizontalDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-horizontal-demo"
import {StepperHorizontalInlineDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-horizontal-inline-demo"
import {StepperIconDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-icon-demo"
import {StepperLinearDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-linear-demo"
import {StepperNonLinearDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-non-linear-demo"
import {StepperNonlinearFormDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-nonlinear-form-demo"
import {StepperPendingDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-pending-demo"
import {StepperSizesDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-sizes-demo"
import {StepperSkippableStepsDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-skippable-steps-demo"
import {StepperVerticalDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-vertical-demo"
import {StepperVerticalInlineDemo} from "@qualcomm-ui/angular-docs/components+/stepper+/demos/stepper-vertical-inline-demo"

@Component({
  imports: [
    StepperCompletedDemo,
    StepperControlledDemo,
    StepperHintDemo,
    StepperHorizontalBottomStartDemo,
    StepperHorizontalDemo,
    StepperHorizontalInlineDemo,
    StepperIconDemo,
    StepperLinearDemo,
    StepperNonLinearDemo,
    StepperNonlinearFormDemo,
    StepperPendingDemo,
    StepperSizesDemo,
    StepperSkippableStepsDemo,
    StepperVerticalDemo,
    StepperVerticalInlineDemo,
  ],
  selector: "app-stepper",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Completed</h2>
        <div class="demo-container">
          <stepper-completed-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled</h2>
        <div class="demo-container">
          <stepper-controlled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Hint</h2>
        <div class="demo-container">
          <stepper-hint-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Horizontal</h2>
        <div class="demo-container">
          <stepper-horizontal-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Horizontal Bottom Start</h2>
        <div class="demo-container">
          <stepper-horizontal-bottom-start-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Horizontal Inline</h2>
        <div class="demo-container">
          <stepper-horizontal-inline-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icon</h2>
        <div class="demo-container">
          <stepper-icon-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Linear</h2>
        <div class="demo-container">
          <stepper-linear-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Non-linear</h2>
        <div class="demo-container">
          <stepper-non-linear-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Non-linear Form</h2>
        <div class="demo-container">
          <stepper-nonlinear-form-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Pending</h2>
        <div class="demo-container">
          <stepper-pending-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <stepper-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Skippable Steps</h2>
        <div class="demo-container">
          <stepper-skippable-steps-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Vertical</h2>
        <div class="demo-container">
          <stepper-vertical-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Vertical Inline</h2>
        <div class="demo-container">
          <stepper-vertical-inline-demo />
        </div>
      </div>
    </div>
  `,
})
export class StepperPage {}
