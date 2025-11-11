import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"
import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [InlineNotificationModule, ButtonModule, LinkDirective],
  selector: "inline-notification-layout-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <div
        description="Description for horizontal"
        dismissable
        label="Horizontal"
        q-inline-notification
      >
        <div q-inline-notification-action q-link>Action</div>
      </div>

      <div
        description="Description for vertical"
        dismissable
        label="Vertical"
        orientation="vertical"
        q-inline-notification
      >
        <button q-inline-notification-action q-link>Action</button>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class InlineNotificationLayoutDemo {}
