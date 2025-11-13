import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "badge-status-variants-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span emphasis="neutral" q-badge type="status" variant="outlined"></span>
      <span emphasis="brand" q-badge type="status" variant="outlined"></span>
      <span emphasis="info" q-badge type="status" variant="outlined"></span>
      <span emphasis="success" q-badge type="status" variant="outlined"></span>
      <span emphasis="warning" q-badge type="status" variant="outlined"></span>
      <span emphasis="danger" q-badge type="status" variant="outlined"></span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeStatusVariantsDemo {}
