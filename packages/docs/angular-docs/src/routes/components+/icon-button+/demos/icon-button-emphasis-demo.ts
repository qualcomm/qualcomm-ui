import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({ExternalLink})],
  selector: "icon-button-emphasis-demo",
  template: `
    <div class="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-1">
      <div class="text-neutral-primary font-heading-xs">Neutral</div>
      <div class="text-neutral-primary font-heading-xs">Primary</div>
      <div class="text-neutral-primary font-heading-xs">Danger</div>

      <!-- preview -->
      <button
        emphasis="neutral"
        icon="ExternalLink"
        q-icon-button
        variant="fill"
      ></button>
      <button
        emphasis="primary"
        icon="ExternalLink"
        q-icon-button
        variant="fill"
      ></button>
      <button
        emphasis="danger"
        icon="ExternalLink"
        q-icon-button
        variant="fill"
      ></button>
      <!-- preview -->
    </div>
  `,
})
export class IconButtonEmphasisDemo {}
