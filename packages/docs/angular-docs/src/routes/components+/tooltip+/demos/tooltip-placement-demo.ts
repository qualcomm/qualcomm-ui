import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {selectCollection} from "@qualcomm-ui/core/select"
import type {Placement} from "@qualcomm-ui/dom/floating-ui"

@Component({
  imports: [TooltipModule, SelectModule, FormsModule, PortalDirective],
  selector: "tooltip-placement",
  template: `
    <div class="flex flex-col">
      <div q-tooltip-root [positioning]="{placement: placement()[0]}">
        <div
          class="w-48"
          q-select-root
          [collection]="collection()"
          [(ngModel)]="placement"
        >
          <span q-tooltip-trigger>
            <button q-select-trigger>
              <span q-select-value-text></span>
              <span q-select-indicator></span>
            </button>
          </span>
          <select q-select-hidden-select></select>
          <ng-template qPortal>
            <div q-select-positioner>
              <div q-select-content>
                <q-select-items />
              </div>
            </div>
          </ng-template>
        </div>
        <q-tooltip-floating-portal>Hello World!</q-tooltip-floating-portal>
      </div>
    </div>
  `,
})
export class TooltipPlacementDemo {
  readonly placement = signal<Placement[]>(["top"])

  readonly collection = signal(
    selectCollection({
      items: [
        "top",
        "bottom",
        "right",
        "left",
        "top-end",
        "bottom-end",
        "right-end",
        "left-end",
        "top-start",
        "bottom-start",
        "right-start",
        "left-start",
      ],
    }),
  )
}
