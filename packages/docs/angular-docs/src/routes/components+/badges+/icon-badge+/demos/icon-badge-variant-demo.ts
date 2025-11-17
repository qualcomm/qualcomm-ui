import {Component} from "@angular/core"
import {Star} from "lucide-angular"

import {IconBadgeDirective} from "@qualcomm-ui/angular/badge"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [IconBadgeDirective],
  providers: [provideIcons({Star})],
  selector: "icon-badge-variant-demo",
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span
          emphasis="neutral"
          icon="Star"
          q-icon-badge
          variant="subtle"
        ></span>
        <span emphasis="brand" icon="Star" q-icon-badge variant="subtle"></span>
        <span emphasis="info" icon="Star" q-icon-badge variant="subtle"></span>
        <span
          emphasis="success"
          icon="Star"
          q-icon-badge
          variant="subtle"
        ></span>
        <span
          emphasis="warning"
          icon="Star"
          q-icon-badge
          variant="subtle"
        ></span>
        <span
          emphasis="danger"
          icon="Star"
          q-icon-badge
          variant="subtle"
        ></span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="cat-1" icon="Star" q-icon-badge variant="subtle"></span>
        <span emphasis="cat-2" icon="Star" q-icon-badge variant="subtle"></span>
        <span emphasis="cat-3" icon="Star" q-icon-badge variant="subtle"></span>
        <span emphasis="cat-4" icon="Star" q-icon-badge variant="subtle"></span>
        <span emphasis="cat-5" icon="Star" q-icon-badge variant="subtle"></span>
        <span emphasis="cat-6" icon="Star" q-icon-badge variant="subtle"></span>
        <span emphasis="cat-7" icon="Star" q-icon-badge variant="subtle"></span>
        <span emphasis="cat-8" icon="Star" q-icon-badge variant="subtle"></span>
        <span emphasis="cat-9" icon="Star" q-icon-badge variant="subtle"></span>
        <span
          emphasis="cat-10"
          icon="Star"
          q-icon-badge
          variant="subtle"
        ></span>
      </div>
    </div>
  `,
})
export class IconBadgeVariantDemo {}
