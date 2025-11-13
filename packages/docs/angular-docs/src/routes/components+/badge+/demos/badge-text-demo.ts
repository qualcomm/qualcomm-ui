import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "badge-text-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-badge>New</span>
      <span q-badge>Pro</span>
      <span q-badge>Beta</span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeTextDemo {}
