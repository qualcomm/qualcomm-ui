import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({ExternalLink})],
  selector: "button-density-demo",
  template: `
    <div class="grid justify-items-center gap-4">
      <!-- preview -->
      <button
        density="compact"
        emphasis="primary"
        q-button
        size="sm"
        startIcon="ExternalLink"
        variant="fill"
      >
        Action
      </button>
      <button
        density="compact"
        emphasis="primary"
        q-button
        size="md"
        startIcon="ExternalLink"
        variant="fill"
      >
        Action
      </button>
      <button
        density="compact"
        emphasis="primary"
        q-button
        size="lg"
        startIcon="ExternalLink"
        variant="fill"
      >
        Action
      </button>
      <!-- preview -->
    </div>
  `,
})
export class ButtonDensityDemo {}
