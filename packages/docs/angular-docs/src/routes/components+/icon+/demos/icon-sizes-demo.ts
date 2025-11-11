import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [IconDirective],
  providers: [provideIcons({ExternalLink})],
  selector: "icon-sizes-demo",
  template: `
    <div class="text-icon-neutral-primary grid justify-center gap-4">
      <div class="flex items-end justify-center gap-4">
        <!-- preview -->
        <svg qIcon="ExternalLink" size="xs"></svg>
        <svg qIcon="ExternalLink" size="sm"></svg>
        <svg qIcon="ExternalLink" size="md"></svg>
        <svg qIcon="ExternalLink" size="lg"></svg>
        <svg qIcon="ExternalLink" size="xl"></svg>
        <!-- preview -->
      </div>
      <div class="flex items-center justify-center gap-4">
        <!-- preview -->
        <svg qIcon="ExternalLink" size="32px"></svg>
        <svg qIcon="ExternalLink" size="42px"></svg>
        <!-- preview -->
      </div>
    </div>
  `,
})
export class IconSizesDemo {}
