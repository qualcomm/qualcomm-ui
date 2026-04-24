import {Component} from "@angular/core"

import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [NumberBadgeDirective],
  selector: "number-badge-variant-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span emphasis="neutral" q-number-badge [value]="5"></span>
      <span emphasis="neutral-outline" q-number-badge [value]="5"></span>
      <span emphasis="brand" q-number-badge [value]="5"></span>
      <span emphasis="brand-outline" q-number-badge [value]="5"></span>
      <span emphasis="info" q-number-badge [value]="5"></span>
      <span emphasis="success" q-number-badge [value]="5"></span>
      <span emphasis="warning" q-number-badge [value]="5"></span>
      <span emphasis="danger" q-number-badge [value]="5"></span>
      <span emphasis="persistent-black" q-number-badge [value]="5"></span>
      <span emphasis="persistent-white" q-number-badge [value]="5"></span>
      <!-- preview -->
    </div>
  `,
})
export class NumberBadgeEmphasisDemo {}
