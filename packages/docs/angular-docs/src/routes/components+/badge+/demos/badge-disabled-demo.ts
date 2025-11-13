import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "badge-disabled-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span q-badge textEmphasis="brand">Enabled</span>
      <span q-badge textEmphasis="brand" [disabled]="true">Disabled</span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeDisabledDemo {}
