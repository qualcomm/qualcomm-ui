import {Component} from "@angular/core"

import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [NumberBadgeDirective],
  selector: "number-badge-disabled-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-number-badge variant="brand" [value]="5"></span>
      <span q-number-badge variant="brand" [disabled]="true" [value]="5"></span>
      <!-- preview -->
    </div>
  `,
})
export class NumberBadgeDisabledDemo {}
