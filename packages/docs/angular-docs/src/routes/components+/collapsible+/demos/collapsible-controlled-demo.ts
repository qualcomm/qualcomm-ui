import {Component, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {CollapsibleModule} from "@qualcomm-ui/angular/collapsible"

@Component({
  imports: [CollapsibleModule, ButtonModule],
  selector: "collapsible-controlled-demo",
  template: `
    <div
      class="flex flex-col items-center"
      q-collapsible-root
      [open]="open()"
      (openChanged)="open.set($event)"
    >
      <button
        class="my-3"
        emphasis="primary"
        q-button
        q-collapsible-trigger
        variant="fill"
      >
        Toggle
      </button>
      <div q-collapsible-content>
        <div
          class="border-neutral-01 flex h-48 w-72 flex-col rounded-sm border p-4"
        >
          Content
        </div>
      </div>
    </div>
  `,
})
export class CollapsibleControlledDemo {
  readonly open = signal(true)
}
