import {Component} from "@angular/core"

import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"
import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [InlineNotificationModule, LinkDirective],
  selector: "inline-notification-composite-demo",
  template: `
    <!-- preview -->
    <div class="w-96" q-inline-notification-root>
      <span q-inline-notification-icon></span>
      <button q-inline-notification-close-button></button>
      <div q-inline-notification-label>Label</div>
      <div q-inline-notification-description>Description</div>
      <button q-inline-notification-action q-link>Action</button>
    </div>
    <!-- preview -->
  `,
})
export class InlineNotificationCompositeDemo {}
