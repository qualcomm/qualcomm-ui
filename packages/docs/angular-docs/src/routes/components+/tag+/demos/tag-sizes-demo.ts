import {Component} from "@angular/core"

import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  selector: "tag-sizes-demo",
  template: `
    <div class="flex flex-col items-center gap-2">
      <!-- preview -->
      <span q-tag size="sm" variant="dismissable">Label</span>
      <span q-tag size="md" variant="dismissable">Label</span>
      <span q-tag size="lg" variant="dismissable">Label</span>
      <span q-tag size="xl" variant="dismissable">Label</span>
      <!-- preview -->
    </div>
  `,
})
export class TagSizesDemo {}
