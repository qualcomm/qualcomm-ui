import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "text-badge-emphasis-demo",
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="neutral" q-badge>Neutral</span>
        <span emphasis="brand" q-badge>Brand</span>
        <span emphasis="info" q-badge>Info</span>
        <span emphasis="success" q-badge>Success</span>
        <span emphasis="warning" q-badge>Warning</span>
        <span emphasis="danger" q-badge>Danger</span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="blue" q-badge>blue</span>
        <span emphasis="cyan" q-badge>cyan</span>
        <span emphasis="green" q-badge>green</span>
        <span emphasis="kiwi" q-badge>kiwi</span>
        <span emphasis="magenta" q-badge>magenta</span>
        <span emphasis="orange" q-badge>orange</span>
        <span emphasis="purple" q-badge>purple</span>
        <span emphasis="red" q-badge>red</span>
        <span emphasis="teal" q-badge>teal</span>
        <span emphasis="yellow" q-badge>yellow</span>
      </div>
    </div>
  `,
})
export class TextBadgeEmphasisDemo {}
