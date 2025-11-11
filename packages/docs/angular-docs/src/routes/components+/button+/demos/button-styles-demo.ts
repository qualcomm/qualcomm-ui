import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({ExternalLink})],
  selector: "button-styles-demo",
  template: `
    <div class="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-1">
      <div class="text-neutral-primary font-heading-xs">Fill</div>
      <div class="text-neutral-primary font-heading-xs">Outline</div>
      <div class="text-neutral-primary font-heading-xs">Ghost</div>

      <!-- preview -->
      <button
        emphasis="primary"
        q-button
        startIcon="ExternalLink"
        variant="fill"
      >
        Action
      </button>
      <button
        emphasis="primary"
        q-button
        startIcon="ExternalLink"
        variant="outline"
      >
        Action
      </button>
      <button
        emphasis="primary"
        q-button
        startIcon="ExternalLink"
        variant="ghost"
      >
        Action
      </button>
      <!-- preview -->
    </div>
  `,
})
export class ButtonStylesDemo {}
