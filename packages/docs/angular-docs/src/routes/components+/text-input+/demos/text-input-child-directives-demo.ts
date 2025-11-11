import {Component} from "@angular/core"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule],
  selector: "text-input-child-directives-demo",
  template: `
    <q-text-input class="w-72" placeholder="Placeholder text">
      <label q-text-input-label>Label</label>
      <div q-text-input-hint>Optional hint</div>
    </q-text-input>
  `,
})
export class TextInputChildDirectivesDemo {}
