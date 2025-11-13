import {Component} from "@angular/core"
import {Star} from "lucide-angular"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [BadgeDirective],
  providers: [provideIcons({Star})],
  selector: "badge-icon-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <span icon="Star" q-badge type="icon"></span>
      <span q-badge type="icon">
        <svg fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </span>
      <!-- preview -->
    </div>
  `,
})
export class BadgeIconDemo {}
