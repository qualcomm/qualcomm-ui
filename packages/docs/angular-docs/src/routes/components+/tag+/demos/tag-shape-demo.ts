import {Component} from "@angular/core"

import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  selector: "tag-shape-demo",

  template: `
    <div class="flex flex-col gap-2">
      <!-- preview -->
      <span q-tag shape="square">Label</span>
      <span q-tag shape="rounded">Label</span>
      <!-- preview -->
    </div>
  `,
})
export class TagShapeDemo {}
