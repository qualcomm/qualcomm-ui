import {Component} from "@angular/core"
import {
  LucideExternalLink,
  LucideMonitorSpeaker,
  LucideSatelliteDish,
} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {IconDirective} from "@qualcomm-ui/angular/icon"

@Component({
  imports: [IconDirective],
  providers: [
    provideIcons({
      LucideExternalLink,
      LucideMonitorSpeaker,
      LucideSatelliteDish,
    }),
  ],
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
