import {Component} from "@angular/core"

import {DividerDirective} from "@qualcomm-ui/angular/divider"

@Component({
  imports: [DividerDirective],
  selector: "divider-focusable",
  template: `
    <!-- preview -->
    <div class="flex flex-col gap-4 px-8">
      <span class="text-neutral-primary font-body-md">
        By default a divider has no tabindex value assigned and is not
        focusable.
      </span>
      <div q-divider></div>
      <span class="text-neutral-primary font-body-md">
        The following divider has a tabindex of 0, which makes it focusable.
      </span>
      <div aria-label="Second section" q-divider tabindex="0"></div>
      <span class="text-neutral-primary font-body-md">
        The following divider has a tabindex of -1, which makes it
        programmatically focusable.
      </span>
      <div aria-label="Third section" q-divider tabindex="-1"></div>
      <span class="text-neutral-primary font-body-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </span>
    </div>
    <!-- preview -->
  `,
})
export class DividerFocusableDemo {}
