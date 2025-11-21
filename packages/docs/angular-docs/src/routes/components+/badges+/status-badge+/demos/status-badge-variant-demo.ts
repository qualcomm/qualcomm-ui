import {Component} from "@angular/core"

import {StatusBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [StatusBadgeDirective],
  selector: "status-badge-variant-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span emphasis="neutral" q-status-badge variant="outlined"></span>
      <span emphasis="brand" q-status-badge variant="outlined"></span>
      <span emphasis="info" q-status-badge variant="outlined"></span>
      <span emphasis="success" q-status-badge variant="outlined"></span>
      <span emphasis="warning" q-status-badge variant="outlined"></span>
      <span emphasis="danger" q-status-badge variant="outlined"></span>
      <!-- preview -->
    </div>
  `,
})
export class StatusBadgeVariantDemo {}
