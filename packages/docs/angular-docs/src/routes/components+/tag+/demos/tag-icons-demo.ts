import {Component} from "@angular/core"
import {LucidePlus} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  providers: [provideIcons({LucidePlus})],
  selector: "tag-icons-demo",
  template: `
    <div class="flex flex-col items-center gap-2">
      <!-- preview -->
      <span emphasis="neutral" q-tag startIcon="Plus">Label</span>
      <span emphasis="neutral" endIcon="Plus" q-tag>Label</span>
      <!-- preview -->
    </div>
  `,
})
export class TagIconsDemo {}
