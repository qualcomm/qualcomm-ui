import {Component} from "@angular/core"
import {LucideExternalLink} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideExternalLink})],
  selector: "icon-button-shape-demo",
  template: `
    <div class="flex gap-2">
      <!-- preview -->
      <button
        aria-label="External Link"
        icon="ExternalLink"
        q-icon-button
        shape="square"
      ></button>
      <button
        aria-label="External Link"
        icon="ExternalLink"
        q-icon-button
        shape="rounded"
      ></button>
      <!-- preview -->
    </div>
  `,
})
export class IconButtonShapeDemo {}
