import {Component} from "@angular/core"
import {ExternalLink} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({ExternalLink})],
  selector: "icon-button-contrast-demo",
  template: `
    <div class="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-5">
      <button
        emphasis="white-persistent"
        icon="ExternalLink"
        q-icon-button
        variant="fill"
      ></button>
      <button
        emphasis="white-persistent"
        icon="ExternalLink"
        q-icon-button
        variant="outline"
      ></button>
      <button
        emphasis="white-persistent"
        icon="ExternalLink"
        q-icon-button
        variant="ghost"
      ></button>

      <div class="col-span-3 grid grid-cols-3 gap-x-8 gap-y-5 bg-white p-2">
        <button
          emphasis="black-persistent"
          icon="ExternalLink"
          q-icon-button
          variant="fill"
        ></button>
        <button
          emphasis="black-persistent"
          icon="ExternalLink"
          q-icon-button
          variant="outline"
        ></button>
        <button
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
