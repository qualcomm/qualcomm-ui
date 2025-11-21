import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "text-badge-disabled-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span emphasis="brand" q-badge>Enabled</span>
      <span emphasis="brand" q-badge [disabled]="true">Disabled</span>
      <!-- preview -->
    </div>
  `,
})
export class TextBadgeDisabledDemo {}
