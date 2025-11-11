import {Component} from "@angular/core"

import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"

@Component({
  imports: [InlineNotificationModule],
  selector: "inline-notification-emphasis-demo",
  template: `
    <div class="grid w-96 gap-4">
      <!-- preview -->
      <div emphasis="info" label="info" q-inline-notification></div>
      <div emphasis="success" label="success" q-inline-notification></div>
      <div emphasis="warning" label="warning" q-inline-notification></div>
      <div emphasis="danger" label="danger" q-inline-notification></div>
      <div emphasis="neutral" label="neutral" q-inline-notification></div>
      <!-- preview -->
    </div>
  `,
})
export class InlineNotificationEmphasisDemo {}
