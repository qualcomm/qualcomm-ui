import {Component} from "@angular/core"

import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"
import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [InlineNotificationModule, LinkDirective],
  selector: "inline-notification-action-demo",
  template: `
    <!-- preview -->
    <div
      class="w-96"
      description="Description for action demo"
      label="Label"
      q-inline-notification
    >
      <button q-inline-notification-action q-link>Action</button>
    </div>
    <!-- preview -->
  `,
})
export class InlineNotificationActionDemo {}
