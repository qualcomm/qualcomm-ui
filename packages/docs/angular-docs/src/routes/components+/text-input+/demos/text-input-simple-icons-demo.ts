import {Component} from "@angular/core"
import {AArrowDown, Calendar} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule],
  providers: [provideIcons({AArrowDown, Calendar})],
  selector: "text-input-simple-icons-demo",
  template: `
    <!-- preview -->
    <q-text-input
      class="w-72"
      defaultValue="Both icons"
      endIcon="Calendar"
      label="Both icons"
      startIcon="AArrowDown"
    />
    <!-- preview -->
  `,
})
export class TextInputSimpleIconsDemo {}
