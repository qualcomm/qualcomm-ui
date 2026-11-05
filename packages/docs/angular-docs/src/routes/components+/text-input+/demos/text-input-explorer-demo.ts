import {Component} from "@angular/core"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule],
  selector: "text-input-explorer-demo",
  template: `
    <q-text-input
      class="w-72"
      clearable
      hint="Some contextual help here"
      label="Username"
      placeholder="Enter username"
    />
  `,
})
export class TextInputExplorerDemo {}
