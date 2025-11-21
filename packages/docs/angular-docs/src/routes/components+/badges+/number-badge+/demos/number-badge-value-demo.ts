import {Component} from "@angular/core"

import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [NumberBadgeDirective],
  selector: "number-badge-value-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-number-badge>42</span>
      <span q-number-badge [value]="5"></span>
      <span q-number-badge [value]="150"></span>
      <!-- preview -->
    </div>
  `,
})
export class NumberBadgeValueDemo {}
