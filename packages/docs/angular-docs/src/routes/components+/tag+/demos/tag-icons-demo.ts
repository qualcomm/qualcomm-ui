import {Component} from "@angular/core"
import {Plus} from "lucide-angular"

import {TagDirective} from "@qualcomm-ui/angular/tag"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [TagDirective],
  providers: [provideIcons({Plus})],
  selector: "tag-icons-demo",
  template: `
    <div class="flex flex-col items-center gap-2">
      <!-- preview -->
      <button emphasis="neutral" q-tag startIcon="Plus">Label</button>
      <button emphasis="neutral" endIcon="Plus" q-tag>Label</button>
      <!-- preview -->
    </div>
  `,
})
export class TagIconsDemo {}
