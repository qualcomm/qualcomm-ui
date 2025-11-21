import {Component} from "@angular/core"
import {Star} from "lucide-angular"

import {IconBadgeDirective} from "@qualcomm-ui/angular/badge"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [IconBadgeDirective],
  providers: [provideIcons({Star})],
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
