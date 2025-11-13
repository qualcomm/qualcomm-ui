import {Component} from "@angular/core"
import {Star} from "lucide-angular"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [BadgeDirective],
  providers: [provideIcons({Star})],
  selector: "badge-icon-sizes-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span icon="Star" q-badge size="xxs" type="icon"></span>
      <span icon="Star" q-badge size="xs" type="icon"></span>
      <span icon="Star" q-badge size="sm" type="icon"></span>
      <span icon="Star" q-badge size="md" type="icon"></span>
      <span icon="Star" q-badge size="lg" type="icon"></span>
      <span icon="Star" q-badge size="xl" type="icon"></span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeIconSizesDemo {}
