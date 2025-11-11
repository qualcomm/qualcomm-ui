import {Component} from "@angular/core"

import {DividerDirective} from "@qualcomm-ui/angular/divider"

@Component({
  imports: [DividerDirective],
  selector: "divider-value-text",
  template: `
    <!-- preview -->
    <div class="flex w-full flex-1 flex-col items-center gap-4 px-8">
      <span class="text-neutral-primary font-body-md">Section 1</span>
      <div
        aria-valuenow="25"
        aria-valuetext="The value is 25"
        q-divider
        tabindex="0"
      ></div>
      <span class="text-neutral-primary font-body-md">Section 2</span>
      <div
        aria-valuenow="50"
        aria-valuetext="The value is 50"
        q-divider
        tabindex="0"
      ></div>
      <span class="text-neutral-primary font-body-md">Section 3</span>
      <div
        aria-valuenow="75"
        aria-valuetext="The value is 75"
        q-divider
        tabindex="0"
      ></div>
      <span class="text-neutral-primary font-body-md">Section 4</span>
    </div>
    <!-- preview -->
  `,
})
export class DividerValueTextDemo {}
