import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  selector: "button-variants-demo",
  template: `
    <div class="grid grid-cols-3 grid-rows-4 gap-x-8 gap-y-5">
      <span class="text-neutral-primary font-heading-xs">Fill</span>
      <span class="text-neutral-primary font-heading-xs">Outline</span>
      <span class="text-neutral-primary font-heading-xs">Ghost</span>

      <!-- preview -->
      <button emphasis="primary" q-button variant="fill">Action</button>
      <button emphasis="primary" q-button variant="outline">Action</button>
      <button emphasis="primary" q-button variant="ghost">Action</button>
      <button emphasis="neutral" q-button variant="fill">Action</button>
      <button emphasis="neutral" q-button variant="outline">Action</button>
      <button emphasis="neutral" q-button variant="ghost">Action</button>
      <button emphasis="danger" q-button variant="fill">Action</button>
      <button emphasis="danger" q-button variant="outline">Action</button>
      <button emphasis="danger" q-button variant="ghost">Action</button>
      <button disabled emphasis="danger" q-button variant="fill">Action</button>
      <button disabled emphasis="danger" q-button variant="outline">
        Action
      </button>
      <button disabled emphasis="danger" q-button variant="ghost">
        Action
      </button>
      <!-- preview -->
    </div>
  `,
})
export class ButtonVariantsDemo {}
