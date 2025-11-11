import {Component} from "@angular/core"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule],
  selector: "text-input-clear-trigger-demo",
  template: `
    <div class="flex w-48 flex-col gap-4">
      <!-- preview -->
      <q-text-input defaultValue="Simple" />

      <div defaultValue="Composite" q-text-input-root>
        <div q-text-input-input-group>
          <input q-text-input-input />
          <button q-text-input-clear-trigger></button>
        </div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class TextInputClearTriggerDemo {}
