import {Component, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"

@Component({
  imports: [TooltipModule, ButtonModule],
  selector: "tooltip-controlled-state-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <!-- preview -->
      <div q-tooltip [open]="open()" (openChanged)="handleOpenChange($event)">
        <button emphasis="primary" q-button q-tooltip-trigger variant="fill">
          Hover me
        </button>
        Hello World!
      </div>
      <!-- preview -->

      <output class="text-neutral-primary block">
        the tooltip is {{ open() ? "open" : "closed" }}
      </output>
    </div>
  `,
})
export class TooltipControlledStateDemo {
  readonly open = signal(false)

  handleOpenChange(open: boolean): void {
    this.open.set(open)
  }
}
