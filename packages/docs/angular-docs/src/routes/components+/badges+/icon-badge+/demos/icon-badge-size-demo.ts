import {Component} from "@angular/core"
import {Star} from "lucide-angular"

import {IconBadgeDirective} from "@qualcomm-ui/angular/badge"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [IconBadgeDirective],
  providers: [provideIcons({Star})],
  selector: "icon-badge-size-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span icon="Star" q-icon-badge size="xxs"></span>
      <span icon="Star" q-icon-badge size="xs"></span>
      <span icon="Star" q-icon-badge size="sm"></span>
      <span icon="Star" q-icon-badge size="md"></span>
      <span icon="Star" q-icon-badge size="lg"></span>
      <span icon="Star" q-icon-badge size="xl"></span>
      <!-- preview -->
    </div>
  `,
})
export class IconBadgeSizeDemo {}
