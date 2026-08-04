import {Component} from "@angular/core"

import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  selector: "tag-states-demo",
  template: `
    <div class="flex flex-col gap-2">
      <!-- preview -->
      <span q-tag variant="dismissable">Label</span>
      <span disabled q-tag variant="dismissable">Label</span>
      <!-- preview -->
    </div>
  `,
})
export class TagStatesDemo {}
