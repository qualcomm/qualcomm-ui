import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  selector: "button-contrast-demo",
  template: `
    <div class="flex flex-col gap-8">
      <!-- preview -->
      <div class="bg-persistent-black flex gap-8 rounded-md p-3">
        <button emphasis="white-persistent" q-button variant="fill">
          Action
        </button>
        <button emphasis="white-persistent" q-button variant="outline">
          Action
        </button>
        <button emphasis="white-persistent" q-button variant="ghost">
          Action
        </button>
      </div>

      <div class="bg-persistent-white flex gap-8 rounded-md p-3">
        <button emphasis="black-persistent" q-button variant="fill">
          Action
        </button>
        <button emphasis="black-persistent" q-button variant="outline">
          Action
        </button>
        <button emphasis="black-persistent" q-button variant="ghost">
          Action
        </button>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class ButtonContrastDemo {}
