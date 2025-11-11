import {Component, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"

@Component({
  imports: [TooltipModule, ButtonModule],
  selector: "tooltip-disabled-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <!-- preview -->
      <div q-tooltip [disabled]="disabled()">
        <button emphasis="primary" q-button q-tooltip-trigger variant="fill">
          Hover me
        </button>
        Hello World!
      </div>
      <!-- preview -->

      <button q-button variant="outline" (click)="disabled.set(!disabled())">
        {{ disabled() ? "Enable" : "Disable" }} tooltip
      </button>
    </div>
  `,
})
export class TooltipDisabledDemo {
  readonly disabled = signal(false)
}
