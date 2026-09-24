import {Component} from "@angular/core"
import {LucideExternalLink} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideExternalLink})],
  selector: "icon-button-density-demo",
  template: `
    <div class="grid justify-items-center gap-4">
      <!-- preview -->
      <button
        aria-label="Navigate"
        density="compact"
        emphasis="primary"
        icon="ExternalLink"
        q-icon-button
        size="sm"
        variant="fill"
      ></button>
      <button
        aria-label="Navigate"
        density="compact"
        emphasis="primary"
        icon="ExternalLink"
        q-icon-button
        size="md"
        variant="fill"
      ></button>
      <button
        aria-label="Navigate"
        density="compact"
        emphasis="primary"
        icon="ExternalLink"
        q-icon-button
        size="lg"
        variant="fill"
      ></button>
      <!-- preview -->
    </div>
  `,
})
export class IconButtonDensityDemo {}
