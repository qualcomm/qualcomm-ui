import {Component} from "@angular/core"
import {LucideStar} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {IconBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [IconBadgeDirective],
  providers: [provideIcons({LucideStar})],
  selector: "icon-badge-disabled-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span emphasis="brand" icon="Star" q-icon-badge></span>
      <span emphasis="brand" icon="Star" q-icon-badge [disabled]="true"></span>
      <!-- preview -->
    </div>
  `,
})
export class IconBadgeDisabledDemo {}
