import {Component} from "@angular/core"

import {ProgressModule} from "@qualcomm-ui/angular/progress"

@Component({
  imports: [ProgressModule],
  selector: "progress-explorer-demo",
  template: `
    <div
      class="w-64"
      hint="Some contextual help here"
      label="Uploading"
      q-progress
      value="64"
      valueText="64%"
    ></div>
  `,
})
export class ProgressExplorerDemo {}
