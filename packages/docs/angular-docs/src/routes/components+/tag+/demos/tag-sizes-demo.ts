import {Component} from "@angular/core"

import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  selector: "tag-sizes-demo",
  template: `
    <div class="flex flex-col items-center gap-2">
      <!-- preview -->
      <button q-tag size="sm" variant="dismissable">Label</button>
      <button q-tag size="md" variant="dismissable">Label</button>
      <button q-tag size="lg" variant="dismissable">Label</button>
      <!-- preview -->
    </div>
  `,
})
export class TagSizesDemo {}
