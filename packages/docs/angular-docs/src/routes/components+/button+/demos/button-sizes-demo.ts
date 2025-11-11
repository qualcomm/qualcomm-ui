import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({ExternalLink})],
  selector: "button-sizes-demo",
  template: `
    <div class="grid justify-items-center gap-4">
      <!-- preview -->
      <button
        emphasis="primary"
        q-button
        size="sm"
        startIcon="ExternalLink"
        variant="fill"
      >
        Action
      </button>
      <button
        emphasis="primary"
        q-button
        size="md"
        startIcon="ExternalLink"
        variant="fill"
      >
        Action
      </button>
      <button
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
export class ButtonSizesDemo {}
