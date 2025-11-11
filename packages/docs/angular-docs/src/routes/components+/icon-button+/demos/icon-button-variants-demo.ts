import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({ExternalLink})],
  selector: "icon-button-variants-demo",
  template: `
    <div class="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-1">
      <div class="text-neutral-primary font-heading-xs">Fill</div>
      <div class="text-neutral-primary font-heading-xs">Outline</div>
      <div class="text-neutral-primary font-heading-xs">Ghost</div>

      <!-- preview -->
      <button icon="ExternalLink" q-icon-button variant="fill"></button>
      <button icon="ExternalLink" q-icon-button variant="outline"></button>
      <button icon="ExternalLink" q-icon-button variant="ghost"></button>
      <!-- preview -->
    </div>
  `,
})
export class IconButtonVariantsDemo {}
