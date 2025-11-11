import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

@Component({
  imports: [CheckboxModule],
  selector: "checkbox-disabled",
  template: `
    <form class="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-2">
      <div class="text-neutral-primary font-heading-xxs">Checked</div>
      <div class="text-neutral-primary font-heading-xxs">Unchecked</div>
      <div class="text-neutral-primary font-heading-xxs">Indeterminate</div>

      <!-- preview -->
      <label defaultChecked disabled label="Label" q-checkbox></label>
      <label disabled label="Label" q-checkbox></label>
      <label disabled indeterminate label="Label" q-checkbox></label>
      <!-- preview -->
    </form>
  `,
})
export class CheckboxDisabledDemo {}
