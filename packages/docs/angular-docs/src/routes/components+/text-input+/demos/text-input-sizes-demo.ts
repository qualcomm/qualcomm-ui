import {Component} from "@angular/core"
import {Search} from "lucide-angular"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [TextInputModule],
  providers: [provideIcons({Search})],
  selector: "text-input-sizes-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <!-- preview -->
      <q-text-input
        class="w-56"
        defaultValue="sm"
        size="sm"
        startIcon="Search"
      />
      <q-text-input
        class="w-60"
        defaultValue="md"
        size="md"
        startIcon="Search"
      />
      <q-text-input
        class="w-64"
        defaultValue="lg"
        size="lg"
        startIcon="Search"
      />
      <!-- preview -->
    </div>
  `,
})
export class TextInputSizesDemo {}
