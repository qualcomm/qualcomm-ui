import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "badge-count-sizes-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-badge size="sm" type="count" [count]="5"></span>
      <span q-badge size="md" type="count" [count]="5"></span>
      <span q-badge size="lg" type="count" [count]="5"></span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeCountSizesDemo {}
