import {Component} from "@angular/core"

import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [NumberBadgeDirective],
  selector: "number-badge-disabled-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span emphasis="brand" q-number-badge [value]="5"></span>
      <span disabled emphasis="brand" q-number-badge [value]="5"></span>
      <!-- preview -->
    </div>
  `,
})
export class NumberBadgeDisabledDemo {}
