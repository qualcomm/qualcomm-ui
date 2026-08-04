import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {SelectModule} from "@qualcomm-ui/angular/select"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"
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
          <div q-tooltip-trigger>
            <div aria-label="Select placement" q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>
          </div>
          <select q-select-hidden-select></select>
          <ng-template qPortal>
            <div q-select-positioner>
              <div q-select-content>
                <q-select-items />
              </div>
            </div>
          </ng-template>
        </div>
        <q-tooltip-floating-portal>
          {{ placement()[0] }}
        </q-tooltip-floating-portal>
      </div>
    </div>
  `,
})
export class TooltipPlacementDemo {
  readonly placement = signal<Placement[]>(["top"])

  readonly collection = signal(
    selectCollection({
      items: [
        "top-start",
        "top",
        "top-end",
        "right-start",
        "right",
        "right-end",
        "bottom-start",
        "bottom",
        "bottom-end",
        "left-start",
        "left",
        "left-end",
      ],
    }),
  )
}
