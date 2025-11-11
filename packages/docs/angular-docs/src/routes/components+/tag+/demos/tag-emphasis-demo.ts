import {Component} from "@angular/core"

import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  selector: "tag-emphasis-demo",
  template: `
    <div class="flex items-center gap-2">
      <!-- preview -->
      <button emphasis="brand" q-tag>Label</button>
      <button emphasis="outline-neutral" q-tag>Label</button>
      <button emphasis="neutral" q-tag>Label</button>
      <!-- preview -->
    </div>
  `,
})
export class TagEmphasisDemo {}
