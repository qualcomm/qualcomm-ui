import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "text-badge-variant-demo",
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="neutral" q-badge variant="subtle">neutral</span>
        <span emphasis="brand" q-badge variant="subtle">brand</span>
        <span emphasis="info" q-badge variant="subtle">info</span>
        <span emphasis="success" q-badge variant="subtle">success</span>
        <span emphasis="warning" q-badge variant="subtle">warning</span>
        <span emphasis="danger" q-badge variant="subtle">danger</span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="blue" q-badge variant="subtle">blue</span>
        <span emphasis="cyan" q-badge variant="subtle">cyan</span>
        <span emphasis="teal" q-badge variant="subtle">teal</span>
        <span emphasis="lime" q-badge variant="subtle">lime</span>
        <span emphasis="green" q-badge variant="subtle">green</span>
        <span emphasis="yellow" q-badge variant="subtle">yellow</span>
        <span emphasis="amber" q-badge variant="subtle">amber</span>
        <span emphasis="orange" q-badge variant="subtle">orange</span>
        <span emphasis="red" q-badge variant="subtle">red</span>
        <span emphasis="magenta" q-badge variant="subtle">magenta</span>
        <span emphasis="violet" q-badge variant="subtle">violet</span>
        <span emphasis="purple" q-badge variant="subtle">purple</span>
      </div>
    </div>
  `,
})
export class TextBadgeVariantDemo {}
