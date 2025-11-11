import {Component} from "@angular/core"
import {ChevronLeft, ChevronRight} from "lucide-angular"

import {LinkDirective} from "@qualcomm-ui/angular/link"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [LinkDirective],
  providers: [provideIcons({ChevronLeft, ChevronRight})],
  selector: "link-icons-demo",
  template: `
    <div class="flex flex-col gap-4">
      <a endIcon="ChevronRight" q-link>Next Page</a>
      <a q-link startIcon="ChevronLeft">Go Back</a>
    </div>
  `,
})
export class LinkIconsDemo {}
