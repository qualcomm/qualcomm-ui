import {Component} from "@angular/core"

import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"

@Component({
  imports: [InlineNotificationModule],
  selector: "inline-notification-dismissable-demo",
  template: `
    <div class="grid w-96 items-start gap-4">
      <!-- preview -->
      <div dismissable label="Label" q-inline-notification></div>

      <div q-inline-notification-root>
        <span q-inline-notification-icon></span>
        <div q-inline-notification-label>Label</div>
        <button q-inline-notification-close-button></button>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class InlineNotificationDismissableDemo {}
