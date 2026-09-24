import {Component} from "@angular/core"
import {LucideAArrowDown} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideAArrowDown})],
  selector: "button-group-shared-props-demo",
  template: `
    <div class="flex w-full flex-col gap-4">
      <div disabled q-button-group size="sm">
        <button q-button startIcon="AArrowDown" variant="ghost">Button</button>
        <button q-button startIcon="AArrowDown" variant="outline">
          Button
        </button>
        <button
          emphasis="primary"
          q-button
          startIcon="AArrowDown"
          variant="fill"
        >
          Button
        </button>
      </div>
      <div q-button-group variant="outline">
        <button q-button startIcon="AArrowDown">Button</button>
        <button q-button startIcon="AArrowDown">Button</button>
        <button emphasis="primary" q-button startIcon="AArrowDown">
          Button
        </button>
      </div>
    </div>
  `,
})
export class ButtonGroupSharedPropsDemo {}
