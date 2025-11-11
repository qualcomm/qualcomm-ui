import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({ExternalLink})],
  selector: "icon-button-sizes-demo",
  template: `
    <div class="grid justify-items-center gap-4">
      <!-- preview -->
      <button
        emphasis="primary"
        icon="ExternalLink"
        q-icon-button
        size="sm"
        variant="fill"
      ></button>
      <button
        emphasis="primary"
        icon="ExternalLink"
        q-icon-button
        size="md"
        variant="fill"
      ></button>
      <button
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
export class IconButtonSizesDemo {}
