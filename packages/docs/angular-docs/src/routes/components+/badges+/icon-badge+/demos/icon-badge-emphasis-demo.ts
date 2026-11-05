import {Component} from "@angular/core"
import {LucideStar} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {IconBadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [IconBadgeDirective],
  providers: [provideIcons({LucideStar})],
  selector: "icon-badge-emphasis-demo",
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="neutral" icon="Star" q-icon-badge></span>
        <span emphasis="brand" icon="Star" q-icon-badge></span>
        <span emphasis="info" icon="Star" q-icon-badge></span>
        <span emphasis="success" icon="Star" q-icon-badge></span>
        <span emphasis="warning" icon="Star" q-icon-badge></span>
        <span emphasis="danger" icon="Star" q-icon-badge></span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="blue" icon="Star" q-icon-badge></span>
        <span emphasis="cyan" icon="Star" q-icon-badge></span>
        <span emphasis="teal" icon="Star" q-icon-badge></span>
        <span emphasis="lime" icon="Star" q-icon-badge></span>
        <span emphasis="green" icon="Star" q-icon-badge></span>
        <span emphasis="yellow" icon="Star" q-icon-badge></span>
        <span emphasis="amber" icon="Star" q-icon-badge></span>
        <span emphasis="orange" icon="Star" q-icon-badge></span>
        <span emphasis="red" icon="Star" q-icon-badge></span>
        <span emphasis="magenta" icon="Star" q-icon-badge></span>
        <span emphasis="violet" icon="Star" q-icon-badge></span>
        <span emphasis="purple" icon="Star" q-icon-badge></span>
      </div>
    </div>
  `,
})
export class IconBadgeEmphasisDemo {}
