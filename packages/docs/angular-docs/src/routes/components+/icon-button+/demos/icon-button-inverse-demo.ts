import {Component} from "@angular/core"
import {LucideExternalLink} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideExternalLink})],
  selector: "icon-button-inverse-demo",
  template: `
    <div class="bg-neutral-10 flex gap-8 rounded-md p-3">
      <!-- preview -->
      <button
        aria-label="Navigate"
        emphasis="inverse"
        icon="ExternalLink"
        q-icon-button
        variant="fill"
      ></button>
      <button
        aria-label="Navigate"
        emphasis="inverse"
        icon="ExternalLink"
        q-icon-button
        variant="outline"
      ></button>
      <button
        aria-label="Navigate"
        emphasis="inverse"
        icon="ExternalLink"
        q-icon-button
        variant="ghost"
      ></button>
      <!-- preview -->
    </div>
  `,
})
export class IconButtonInverseDemo {}
