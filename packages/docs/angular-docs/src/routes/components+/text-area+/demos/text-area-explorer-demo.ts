import {Component} from "@angular/core"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule],
  selector: "text-area-explorer-demo",
  template: `
    <q-text-area
      class="w-72"
      hint="Some contextual help here"
      label="Description"
      placeholder="Enter a description"
      [maxLength]="200"
    />
  `,
})
export class TextAreaExplorerDemo {}
