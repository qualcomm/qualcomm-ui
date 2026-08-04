import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({ExternalLink})],
  selector: "icon-button-contrast-demo",
  template: `
    <div class="flex flex-col gap-8">
      <div class="bg-persistent-black flex gap-8 rounded-md p-3">
        <button
          aria-label="External Link"
          emphasis="white-persistent"
          icon="ExternalLink"
          q-icon-button
          variant="fill"
        ></button>
        <button
          aria-label="External Link"
          emphasis="white-persistent"
          icon="ExternalLink"
          q-icon-button
          variant="outline"
        ></button>
        <button
          aria-label="External Link"
          emphasis="white-persistent"
          icon="ExternalLink"
          q-icon-button
          variant="ghost"
        ></button>
      </div>

      <div class="bg-persistent-white flex gap-8 rounded-md p-3">
        <button
          aria-label="External Link"
          emphasis="black-persistent"
          icon="ExternalLink"
          q-icon-button
          variant="fill"
        ></button>
        <button
          aria-label="External Link"
          emphasis="black-persistent"
          icon="ExternalLink"
          q-icon-button
          variant="outline"
        ></button>
        <button
          aria-label="External Link"
          emphasis="black-persistent"
          icon="ExternalLink"
          q-icon-button
          variant="ghost"
        ></button>
      </div>
    </div>
  `,
})
export class IconButtonContrastDemo {}
