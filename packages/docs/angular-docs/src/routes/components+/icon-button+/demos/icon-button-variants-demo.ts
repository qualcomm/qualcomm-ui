import {Component} from "@angular/core"
import {LucideExternalLink} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideExternalLink})],
  selector: "icon-button-variants-demo",
  template: `
    <div class="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-1">
      <div class="text-neutral-primary font-heading-xs">Fill</div>
      <div class="text-neutral-primary font-heading-xs">Outline</div>
      <div class="text-neutral-primary font-heading-xs">Ghost</div>

      <!-- preview -->
      <button
        aria-label="External Link"
        icon="ExternalLink"
        q-icon-button
        variant="fill"
      ></button>
      <button
        aria-label="External Link"
        icon="ExternalLink"
        q-icon-button
        variant="outline"
      ></button>
      <button
        aria-label="External Link"
        icon="ExternalLink"
        q-icon-button
        variant="ghost"
      ></button>
      <!-- preview -->
    </div>
  `,
})
export class IconButtonVariantsDemo {}
