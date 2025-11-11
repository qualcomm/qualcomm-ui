import {Component} from "@angular/core"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule],
  selector: "text-input-composite-layout-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <div q-text-input-root size="sm">
        <div class="flex items-center gap-4">
          <label class="font-body-sm-bold w-48" q-text-input-label>
            Project Name
          </label>
          <div q-text-input-input-group>
            <input class="w-full" placeholder="QVSCE" q-text-input-input />
          </div>
        </div>
      </div>

      <div q-text-input-root size="sm">
        <div class="flex items-center gap-4">
          <label class="font-body-sm-bold w-48" q-text-input-label>
            Project Version
          </label>
          <div q-text-input-input-group>
            <input class="w-full" placeholder="v1.2.3" q-text-input-input />
          </div>
        </div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class TextInputCompositeLayoutDemo {}
