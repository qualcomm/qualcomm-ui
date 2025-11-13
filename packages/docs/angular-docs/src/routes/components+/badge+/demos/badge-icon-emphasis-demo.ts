import {Component} from "@angular/core"
import {Star} from "lucide-angular"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [BadgeDirective],
  providers: [provideIcons({Star})],
  selector: "badge-icon-emphasis-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span emphasis="neutral" icon="Star" q-badge type="icon"></span>
      <span emphasis="brand" icon="Star" q-badge type="icon"></span>
      <span emphasis="info" icon="Star" q-badge type="icon"></span>
      <span emphasis="success" icon="Star" q-badge type="icon"></span>
      <span emphasis="warning" icon="Star" q-badge type="icon"></span>
      <span emphasis="danger" icon="Star" q-badge type="icon"></span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeIconEmphasisDemo {}
