import {Component} from "@angular/core"
import {ExternalLink, MonitorSpeaker, SatelliteDish} from "lucide-angular"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [IconDirective],
  providers: [provideIcons({ExternalLink, MonitorSpeaker, SatelliteDish})],
  selector: "icon-provider-demo",
  standalone: true,
  template: `
    <div class="text-foreground-primary flex justify-center gap-4">
      <!-- preview -->
      <svg aria-label="Link" qIcon="ExternalLink" size="lg"></svg>
      <svg aria-label="Search" qIcon="MonitorSpeaker" size="lg"></svg>
      <svg aria-label="Eye" qIcon="SatelliteDish" size="lg"></svg>
      <!-- preview -->
    </div>
  `,
})
export class IconProviderDemo {}
