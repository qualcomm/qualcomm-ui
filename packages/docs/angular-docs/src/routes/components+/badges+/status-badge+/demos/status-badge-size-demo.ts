import {Component} from "@angular/core"

import {StatusBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [StatusBadgeDirective],
  selector: "status-badge-size-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-status-badge size="xs"></span>
      <span q-status-badge size="sm"></span>
      <span q-status-badge size="md"></span>
      <span q-status-badge size="lg"></span>
      <span q-status-badge size="xl"></span>
      <!-- preview -->
    </div>
  `,
})
export class StatusBadgeSizeDemo {}
