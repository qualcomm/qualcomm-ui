import {Component} from "@angular/core"
import {LucideChevronLeft, LucideChevronRight} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [LinkDirective],
  providers: [provideIcons({LucideChevronLeft, LucideChevronRight})],
  selector: "link-icons-demo",
  template: `
    <div class="flex flex-col gap-4">
      <a endIcon="ChevronRight" q-link>Next Page</a>
      <a q-link startIcon="ChevronLeft">Go Back</a>
    </div>
  `,
})
export class LinkIconsDemo {}
