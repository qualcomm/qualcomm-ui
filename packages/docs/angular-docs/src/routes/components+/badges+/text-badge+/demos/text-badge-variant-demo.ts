import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"

@Component({
  imports: [BadgeDirective],
  selector: "text-badge-variant-demo",
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="neutral" q-badge variant="subtle">Neutral</span>
        <span emphasis="brand" q-badge variant="subtle">Brand</span>
        <span emphasis="info" q-badge variant="subtle">Info</span>
        <span emphasis="success" q-badge variant="subtle">Success</span>
        <span emphasis="warning" q-badge variant="subtle">Warning</span>
        <span emphasis="danger" q-badge variant="subtle">Danger</span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span emphasis="cat-1" q-badge variant="subtle">Cat 1</span>
        <span emphasis="cat-2" q-badge variant="subtle">Cat 2</span>
        <span emphasis="cat-3" q-badge variant="subtle">Cat 3</span>
        <span emphasis="cat-4" q-badge variant="subtle">Cat 4</span>
        <span emphasis="cat-5" q-badge variant="subtle">Cat 5</span>
        <span emphasis="cat-6" q-badge variant="subtle">Cat 6</span>
        <span emphasis="cat-7" q-badge variant="subtle">Cat 7</span>
        <span emphasis="cat-8" q-badge variant="subtle">Cat 8</span>
        <span emphasis="cat-9" q-badge variant="subtle">Cat 9</span>
        <span emphasis="cat-10" q-badge variant="subtle">Cat 10</span>
      </div>
    </div>
  `,
})
export class TextBadgeVariantDemo {}
