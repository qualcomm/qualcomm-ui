import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {LinkDirective} from "@qualcomm-ui/angular/link"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

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
