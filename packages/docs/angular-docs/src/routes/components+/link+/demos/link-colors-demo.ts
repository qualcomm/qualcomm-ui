import {Component} from "@angular/core"

import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [LinkDirective],
  selector: "link-colors-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <!-- preview -->
      <a q-link>default</a>
      <a emphasis="neutral" q-link>neutral</a>
      <a emphasis="brand" q-link>brand</a>
      <div class="bg-persistent-black px-4 py-1">
        <a emphasis="persistent-white" q-link>persistent-white</a>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class LinkColorsDemo {}
