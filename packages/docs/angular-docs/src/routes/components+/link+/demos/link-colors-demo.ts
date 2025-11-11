import {Component} from "@angular/core"

import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [LinkDirective],
  selector: "link-colors-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <a q-link>Default</a>
      <a emphasis="neutral" q-link>Neutral</a>
      <!-- preview -->
    </div>
  `,
})
export class LinkColorsDemo {}
