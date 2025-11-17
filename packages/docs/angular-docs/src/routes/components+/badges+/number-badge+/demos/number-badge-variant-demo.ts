import {Component} from "@angular/core"

import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [NumberBadgeDirective],
  selector: "number-badge-variant-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-number-badge variant="neutral" [value]="5"></span>
      <span q-number-badge variant="neutral-outline" [value]="5"></span>
      <span q-number-badge variant="brand" [value]="5"></span>
      <span q-number-badge variant="brand-outline" [value]="5"></span>
      <span q-number-badge variant="info" [value]="5"></span>
      <span q-number-badge variant="success" [value]="5"></span>
      <span q-number-badge variant="warning" [value]="5"></span>
      <span q-number-badge variant="danger" [value]="5"></span>
      <span q-number-badge variant="persistent-black" [value]="5"></span>
      <span q-number-badge variant="persistent-white" [value]="5"></span>
      <!-- preview -->
    </div>
  `,
})
export class NumberBadgeVariantDemo {}
