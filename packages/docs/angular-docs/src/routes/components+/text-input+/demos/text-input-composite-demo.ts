import {Component} from "@angular/core"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule],
  selector: "text-input-composite-demo",
  template: `
    <!-- preview -->
    <div class="w-72" q-text-input-root>
      <label q-text-input-label>Label</label>
      <div q-text-input-input-group>
        <input placeholder="Placeholder text" q-text-input-input />
        <button q-text-input-clear-trigger></button>
        <span q-text-input-error-indicator></span>
      </div>
      <div q-text-input-hint>Optional hint</div>
      <div q-text-input-error-text>Error text</div>
    </div>
    <!-- preview -->
  `,
})
export class TextInputCompositeDemo {}
