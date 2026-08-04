import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [LinkDirective],
  providers: [provideIcons({ExternalLink})],
  selector: "link-disabled-demo",
  template: `
    <!-- preview -->
    <a disabled endIcon="ExternalLink" q-link>Disabled</a>
    <!-- preview -->
  `,
})
export class LinkDisabledDemo {}
