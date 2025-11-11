import {Component} from "@angular/core"
import {AArrowDown, Calendar} from "lucide-angular"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

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
