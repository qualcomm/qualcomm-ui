import {Component} from "@angular/core"

import {StatusBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [StatusBadgeDirective],
  selector: "status-badge-emphasis-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span emphasis="neutral" q-status-badge></span>
      <span emphasis="brand" q-status-badge></span>
      <span emphasis="info" q-status-badge></span>
      <span emphasis="success" q-status-badge></span>
      <span emphasis="warning" q-status-badge></span>
      <span emphasis="danger" q-status-badge></span>
      <!-- preview -->
    </div>
  `,
})
export class StatusBadgeEmphasisDemo {}
