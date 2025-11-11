import {Component} from "@angular/core"

import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  selector: "tag-states-demo",
  template: `
    <div class="flex flex-col gap-2">
      <!-- preview -->
      <button q-tag variant="dismissable">Label</button>
      <button disabled q-tag variant="dismissable">Label</button>
      <!-- preview -->
    </div>
  `,
})
export class TagStatesDemo {}
