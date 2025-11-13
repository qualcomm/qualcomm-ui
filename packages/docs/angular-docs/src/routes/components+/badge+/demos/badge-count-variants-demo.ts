import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "badge-count-variants-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-badge type="count" variant="neutral" [count]="5"></span>
      <span q-badge type="count" variant="neutral-outline" [count]="5"></span>
      <span q-badge type="count" variant="brand" [count]="5"></span>
      <span q-badge type="count" variant="brand-outline" [count]="5"></span>
      <span q-badge type="count" variant="info" [count]="5"></span>
      <span q-badge type="count" variant="success" [count]="5"></span>
      <span q-badge type="count" variant="warning" [count]="5"></span>
      <span q-badge type="count" variant="danger" [count]="5"></span>
      <span q-badge type="count" variant="persistent-black" [count]="5"></span>
      <span q-badge type="count" variant="persistent-white" [count]="5"></span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeCountVariantsDemo {}
