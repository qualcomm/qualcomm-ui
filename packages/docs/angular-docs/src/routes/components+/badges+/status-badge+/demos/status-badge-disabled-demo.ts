import {Component} from "@angular/core"

import {StatusBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [StatusBadgeDirective],
  selector: "status-badge-disabled-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span emphasis="brand" q-status-badge></span>
      <span emphasis="brand" q-status-badge [disabled]="true"></span>
      <!-- preview -->
    </div>
  `,
})
export class StatusBadgeDisabledDemo {}
