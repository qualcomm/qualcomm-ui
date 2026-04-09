import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "text-badge-emphasis-demo",
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="neutral" q-badge>neutral</span>
        <span emphasis="brand" q-badge>brand</span>
        <span emphasis="info" q-badge>info</span>
        <span emphasis="success" q-badge>success</span>
        <span emphasis="warning" q-badge>warning</span>
        <span emphasis="danger" q-badge>danger</span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="blue" q-badge>blue</span>
        <span emphasis="cyan" q-badge>cyan</span>
        <span emphasis="teal" q-badge>teal</span>
        <span emphasis="lime" q-badge>lime</span>
        <span emphasis="green" q-badge>green</span>
        <span emphasis="yellow" q-badge>yellow</span>
        <span emphasis="amber" q-badge>amber</span>
        <span emphasis="orange" q-badge>orange</span>
        <span emphasis="red" q-badge>red</span>
        <span emphasis="magenta" q-badge>magenta</span>
        <span emphasis="violet" q-badge>violet</span>
        <span emphasis="purple" q-badge>purple</span>
      </div>
    </div>
  `,
})
export class TextBadgeEmphasisDemo {}
