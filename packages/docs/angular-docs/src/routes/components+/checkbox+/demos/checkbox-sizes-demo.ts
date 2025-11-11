import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

@Component({
  imports: [CheckboxModule],
  selector: "checkbox-sizes-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <label label="Small (sm)" q-checkbox size="sm"></label>
      <label label="Medium (md)" q-checkbox size="md"></label>
      <label label="Large (lg)" q-checkbox size="lg"></label>
    </div>
  `,
})
export class CheckboxSizesDemo {}
