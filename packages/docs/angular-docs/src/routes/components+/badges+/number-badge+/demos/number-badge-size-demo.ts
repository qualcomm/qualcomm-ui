import {Component} from "@angular/core"

import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [NumberBadgeDirective],
  selector: "number-badge-size-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-number-badge size="sm" [value]="5"></span>
      <span q-number-badge size="md" [value]="5"></span>
      <span q-number-badge size="lg" [value]="5"></span>
      <!-- preview -->
    </div>
  `,
})
export class NumberBadgeSizeDemo {}
