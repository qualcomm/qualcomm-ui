import {Component} from "@angular/core"
import {Search} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({Search})],
  selector: "icon-button-variant-combinations-demo",
  template: `
    <div class="grid grid-cols-3 grid-rows-4 gap-x-8 gap-y-5">
      <span class="text-neutral-primary font-heading-xs">Fill</span>
      <span class="text-neutral-primary font-heading-xs">Outline</span>
      <span class="text-neutral-primary font-heading-xs">Ghost</span>

      <button
        emphasis="neutral"
        icon="Search"
        q-icon-button
        variant="fill"
      ></button>
      <button
        emphasis="neutral"
        icon="Search"
        q-icon-button
        variant="outline"
      ></button>
      <button
        emphasis="neutral"
        icon="Search"
        q-icon-button
        variant="ghost"
      ></button>

      <button
        emphasis="primary"
        icon="Search"
        q-icon-button
        variant="fill"
      ></button>
      <button
        emphasis="primary"
        icon="Search"
        q-icon-button
        variant="outline"
      ></button>
      <button
        emphasis="primary"
        icon="Search"
        q-icon-button
        variant="ghost"
      ></button>

      <button
        emphasis="danger"
        icon="Search"
        q-icon-button
        variant="fill"
      ></button>
      <button
        emphasis="danger"
        icon="Search"
        q-icon-button
        variant="outline"
      ></button>
      <button
        emphasis="danger"
        icon="Search"
        q-icon-button
        variant="ghost"
      ></button>

      <button disabled icon="Search" q-icon-button variant="fill"></button>
      <button disabled icon="Search" q-icon-button variant="outline"></button>
      <button disabled icon="Search" q-icon-button variant="ghost"></button>
    </div>
  `,
})
export class IconButtonVariantCombinationsDemo {}
