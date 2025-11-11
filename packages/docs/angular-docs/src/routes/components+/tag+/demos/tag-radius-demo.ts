import {Component} from "@angular/core"

import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  selector: "tag-radius-demo",

  template: `
    <div class="flex flex-col gap-2">
      <!-- preview -->
      <button q-tag radius="square">Label</button>
      <button q-tag radius="rounded">Label</button>
      <!-- preview -->
    </div>
  `,
})
export class TagRadiusDemo {}
