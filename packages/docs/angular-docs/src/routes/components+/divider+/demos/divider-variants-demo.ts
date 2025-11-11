import {Component} from "@angular/core"

import {DividerDirective} from "@qualcomm-ui/angular/divider"

@Component({
  imports: [DividerDirective],
  selector: "divider-variants",
  template: `
    <!-- preview -->
    <div class="flex flex-col gap-4 px-8">
      <span class="text-neutral-primary font-body-md">
        subtle: Low contrast, less visually prominent
      </span>
      <div q-divider variant="subtle"></div>
      <span class="text-neutral-primary font-body-md">
        normal (default): Standard appearance with balanced visibility
      </span>
      <div q-divider></div>
      <span class="text-neutral-primary font-body-md">
        strong: High contrast, maximum visual separation
      </span>
      <div q-divider variant="strong"></div>
    </div>
    <!-- preview -->
  `,
})
export class DividerVariantsDemo {}
