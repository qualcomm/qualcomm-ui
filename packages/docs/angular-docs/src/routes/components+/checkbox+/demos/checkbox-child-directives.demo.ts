import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

@Component({
  imports: [CheckboxModule],
  selector: "checkbox-child-directives-demo",
  template: `
    <!-- preview -->
    <label q-checkbox>
      <div q-checkbox-label>Label</div>
    </label>
    <!-- preview -->
  `,
})
export class CheckboxChildDirectivesDemo {}
