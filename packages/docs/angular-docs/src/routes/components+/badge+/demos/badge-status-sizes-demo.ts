import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "badge-status-sizes-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-badge size="xs" type="status"></span>
      <span q-badge size="sm" type="status"></span>
      <span q-badge size="md" type="status"></span>
      <span q-badge size="lg" type="status"></span>
      <span q-badge size="xl" type="status"></span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeStatusSizesDemo {}
