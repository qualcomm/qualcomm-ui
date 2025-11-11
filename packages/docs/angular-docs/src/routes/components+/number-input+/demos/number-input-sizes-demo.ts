import {Component} from "@angular/core"
import {Sigma} from "lucide-angular"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [NumberInputModule],
  providers: [provideIcons({Sigma})],
  selector: "number-input-sizes-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <!-- preview -->
      <q-number-input
        class="w-56"
        placeholder="sm"
        size="sm"
        startIcon="Sigma"
      />
      <q-number-input
        class="w-64"
        placeholder="md"
        size="md"
        startIcon="Sigma"
      />
      <q-number-input
        class="w-72"
        placeholder="lg"
        size="lg"
        startIcon="Sigma"
      />
      <!-- preview -->
    </div>
  `,
})
export class NumberInputSizesDemo {}
