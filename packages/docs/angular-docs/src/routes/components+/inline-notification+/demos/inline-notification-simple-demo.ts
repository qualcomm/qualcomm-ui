import {Component} from "@angular/core"

import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"

@Component({
  imports: [InlineNotificationModule],
  selector: "inline-notification-simple-demo",
  template: `
    <!-- preview -->
    <div
      class="w-96"
      description="Description"
      dismissable
      label="Label"
      q-inline-notification
    ></div>
    <!-- preview -->
  `,
})
export class InlineNotificationSimpleDemo {}
