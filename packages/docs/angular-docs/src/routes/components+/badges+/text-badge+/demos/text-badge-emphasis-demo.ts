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
        <span emphasis="cat-1" q-badge>Cat 1</span>
        <span emphasis="cat-2" q-badge>Cat 2</span>
        <span emphasis="cat-3" q-badge>Cat 3</span>
        <span emphasis="cat-4" q-badge>Cat 4</span>
        <span emphasis="cat-5" q-badge>Cat 5</span>
        <span emphasis="cat-6" q-badge>Cat 6</span>
        <span emphasis="cat-7" q-badge>Cat 7</span>
        <span emphasis="cat-8" q-badge>Cat 8</span>
        <span emphasis="cat-9" q-badge>Cat 9</span>
        <span emphasis="cat-10" q-badge>Cat 10</span>
      </div>
    </div>
  `,
})
export class TextBadgeEmphasisDemo {}
