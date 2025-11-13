import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "badge-count-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-badge type="count">42</span>
      <span q-badge type="count" [count]="5"></span>
      <span q-badge type="count" [count]="150"></span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeCountDemo {}
