import {Component} from "@angular/core"
import {LucideAArrowDown} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import type {QdsButtonGroupLayout} from "@qualcomm-ui/qds-core/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideAArrowDown})],
  selector: "button-group-layout-demo",
  template: `
    <div class="flex w-full flex-col gap-4">
      <!-- preview -->
      @for (layout of layouts; track layout) {
        <div
          class="border-brand-primary border-1 border-dashed p-1.5"
          q-button-group
          [layout]="layout"
        >
          <button q-button startIcon="AArrowDown" variant="ghost">
            Button
          </button>
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
      }
      <!-- preview -->
    </div>
  `,
})
export class ButtonGroupLayoutDemo {
  protected layouts: QdsButtonGroupLayout[] = ["hug", "start", "end", "fill"]
}
