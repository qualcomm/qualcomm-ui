import {Component} from "@angular/core"
import {AArrowDown, Calendar} from "lucide-angular"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [TextInputModule],
  providers: [provideIcons({AArrowDown, Calendar})],
  selector: "text-input-icons-demo",
  template: `
    <!-- preview -->
    <div
      class="w-72"
      defaultValue="Both icons with clear button"
      q-text-input-root
    >
      <label q-text-input-label>Start + End icons</label>
      <div endIcon="Calendar" q-text-input-input-group startIcon="AArrowDown">
        <input placeholder="Placeholder text" q-text-input-input />
        <button q-text-input-clear-trigger></button>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class TextInputCompositeIconsDemo {}
