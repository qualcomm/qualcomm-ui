import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {LinkDirective} from "@qualcomm-ui/angular/link"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [LinkDirective],
  providers: [provideIcons({ExternalLink})],
  selector: "link-sizes-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <!-- preview -->
      <a endIcon="ExternalLink" q-link size="xs">Link</a>
      <a endIcon="ExternalLink" q-link size="sm">Link</a>
      <a endIcon="ExternalLink" q-link size="md">Link</a>
      <a endIcon="ExternalLink" q-link size="lg">Link</a>
      <a endIcon="ExternalLink" q-link size="xl">Link</a>
      <a endIcon="ExternalLink" q-link size="xxl">Link</a>
      <!-- preview -->
    </div>
  `,
})
export class LinkSizesDemo {}
