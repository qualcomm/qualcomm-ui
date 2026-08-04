import {Component} from "@angular/core"
import {Search} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

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
        aria-label="External Link"
        emphasis="neutral"
        icon="Search"
        q-icon-button
        variant="fill"
      ></button>
      <button
        aria-label="External Link"
        emphasis="neutral"
        icon="Search"
        q-icon-button
        variant="outline"
      ></button>
      <button
        aria-label="External Link"
        emphasis="neutral"
        icon="Search"
        q-icon-button
        variant="ghost"
      ></button>

      <button
        aria-label="External Link"
        emphasis="primary"
        icon="Search"
        q-icon-button
        variant="fill"
      ></button>
      <button
        aria-label="External Link"
        emphasis="primary"
        icon="Search"
        q-icon-button
        variant="outline"
      ></button>
      <button
        aria-label="External Link"
        emphasis="primary"
        icon="Search"
        q-icon-button
        variant="ghost"
      ></button>

      <button
        aria-label="External Link"
        emphasis="danger"
        icon="Search"
        q-icon-button
        variant="fill"
      ></button>
      <button
        aria-label="External Link"
        emphasis="danger"
        icon="Search"
        q-icon-button
        variant="outline"
      ></button>
      <button
        aria-label="External Link"
        emphasis="danger"
        icon="Search"
        q-icon-button
        variant="ghost"
      ></button>

      <button
        aria-label="External Link"
        disabled
        icon="Search"
        q-icon-button
        variant="fill"
      ></button>
      <button
        aria-label="External Link"
        disabled
        icon="Search"
        q-icon-button
        variant="outline"
      ></button>
      <button
        aria-label="External Link"
        disabled
        icon="Search"
        q-icon-button
        variant="ghost"
      ></button>
    </div>
  `,
})
export class IconButtonVariantCombinationsDemo {}
