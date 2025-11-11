import {Component} from "@angular/core"
import {Link2} from "lucide-angular"

import {TagDirective} from "@qualcomm-ui/angular/tag"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [TagDirective],
  providers: [provideIcons({Link2})],
  selector: "tag-variants-demo",

  template: `
    <div class="flex flex-col items-start gap-2">
      <!-- preview -->
      <button endIcon="Link2" q-tag variant="link">link</button>
      <button q-tag variant="selectable">selectable</button>
      <button q-tag variant="dismissable">dismissable</button>
      <!-- preview -->
    </div>
  `,
})
export class TagVariantsDemo {}
