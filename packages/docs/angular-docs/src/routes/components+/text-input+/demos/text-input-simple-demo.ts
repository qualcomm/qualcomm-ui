import {Component} from "@angular/core"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule],
  selector: "text-input-simple-demo",
  template: `
    <!-- preview -->
    <q-text-input
      class="w-72"
      hint="Optional hint"
      label="Label"
      placeholder="Placeholder text"
    />
    <!-- preview -->
  `,
})
export class TextInputSimpleDemo {}
