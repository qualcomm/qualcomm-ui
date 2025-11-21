import {Component} from "@angular/core"

import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [NumberBadgeDirective],
  selector: "number-badge-max-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-number-badge [value]="99"></span>
      <span q-number-badge [value]="100"></span>
      <span q-number-badge [max]="50" [value]="50"></span>
      <span q-number-badge [max]="50" [value]="51"></span>
      <!-- preview -->
    </div>
  `,
})
export class NumberBadgeMaxDemo {}
