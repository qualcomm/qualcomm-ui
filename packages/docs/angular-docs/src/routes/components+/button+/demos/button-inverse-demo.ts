import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  selector: "button-inverse-demo",
  template: `
    <div class="bg-neutral-10 flex gap-8 rounded-md p-3">
      <!-- preview -->
      <button emphasis="inverse" q-button variant="fill">Action</button>
      <button emphasis="inverse" q-button variant="outline">Action</button>
      <button emphasis="inverse" q-button variant="ghost">Action</button>
      <!-- preview -->
    </div>
  `,
})
export class ButtonInverseDemo {}
