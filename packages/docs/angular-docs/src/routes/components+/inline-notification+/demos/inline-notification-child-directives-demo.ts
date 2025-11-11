import {Component} from "@angular/core"

import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"

@Component({
  imports: [InlineNotificationModule],
  selector: "inline-notification-child-directives-demo",
  template: `
    <!-- preview -->
    <div class="w-96" dismissable q-inline-notification>
      <div q-inline-notification-label>Label</div>
      <div q-inline-notification-description>Description</div>
    </div>
    <!-- preview -->
  `,
})
export class InlineNotificationChildDirectivesDemo {}
