import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "badge-count-max-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-badge type="count" [count]="99"></span>
      <span q-badge type="count" [count]="100"></span>
      <span q-badge type="count" [count]="50" [max]="50"></span>
      <span q-badge type="count" [count]="51" [max]="50"></span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeCountMaxDemo {}
