import {Component} from "@angular/core"

import {DividerDirective} from "@qualcomm-ui/angular/divider"

@Component({
  imports: [DividerDirective],
  selector: "divider-orientation",
  template: `
    <!-- preview -->
    <div class="flex gap-4 px-8">
      <span class="text-neutral-primary font-body-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </span>
      <div orientation="vertical" q-divider></div>
      <span class="text-neutral-primary font-body-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </span>
    </div>
    <!-- preview -->
  `,
})
export class DividerOrientationDemo {}
