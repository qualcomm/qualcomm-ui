import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "badge-text-sizes-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-badge size="sm">Small</span>
      <span q-badge size="md">Medium</span>
      <span q-badge size="lg">Large</span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeTextSizesDemo {}
