import {Component} from "@angular/core"

import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"
import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [InlineNotificationModule, LinkDirective],
  selector: "inline-notification-explorer-demo",
  template: `
    <div
      class="w-96"
      description="Description"
      dismissable
      label="Label"
      q-inline-notification
    >
      <button q-inline-notification-action q-link>Text link</button>
    </div>
  `,
})
export class InlineNotificationExplorerDemo {}
