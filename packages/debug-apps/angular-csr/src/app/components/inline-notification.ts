import {Component} from "@angular/core"

import {InlineNotificationActionDemo} from "@qualcomm-ui/angular-docs/components+/inline-notification+/demos/inline-notification-action-demo"
import {InlineNotificationChildDirectivesDemo} from "@qualcomm-ui/angular-docs/components+/inline-notification+/demos/inline-notification-child-directives-demo"
import {InlineNotificationCompositeDemo} from "@qualcomm-ui/angular-docs/components+/inline-notification+/demos/inline-notification-composite-demo"
import {InlineNotificationDismissableDemo} from "@qualcomm-ui/angular-docs/components+/inline-notification+/demos/inline-notification-dismissable-demo"
import {InlineNotificationEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/inline-notification+/demos/inline-notification-emphasis-demo"
import {InlineNotificationLayoutDemo} from "@qualcomm-ui/angular-docs/components+/inline-notification+/demos/inline-notification-layout-demo"
import {InlineNotificationSimpleDemo} from "@qualcomm-ui/angular-docs/components+/inline-notification+/demos/inline-notification-simple-demo"

@Component({
  imports: [
    InlineNotificationActionDemo,
    InlineNotificationChildDirectivesDemo,
    InlineNotificationCompositeDemo,
    InlineNotificationDismissableDemo,
    InlineNotificationEmphasisDemo,
    InlineNotificationLayoutDemo,
    InlineNotificationSimpleDemo,
  ],
  selector: "app-inline-notification",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Action</h2>
        <div class="demo-container">
          <inline-notification-action-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Child Directives</h2>
        <div class="demo-container">
          <inline-notification-child-directives-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <inline-notification-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Dismissable</h2>
        <div class="demo-container">
          <inline-notification-dismissable-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <inline-notification-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Layout</h2>
        <div class="demo-container">
          <inline-notification-layout-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <inline-notification-simple-demo />
        </div>
      </div>
    </div>
  `,
})
export class InlineNotificationPage {}
