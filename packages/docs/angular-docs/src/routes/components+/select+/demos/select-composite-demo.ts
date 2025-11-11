import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule, PortalDirective],
  selector: "select-composite-demo",
  template: `
    <!-- preview -->
    <div
      class="w-48"
      placeholder="Select a city"
      q-select-root
      [collection]="cityCollection"
    >
      <div q-select-label>City</div>

      <div q-select-control>
        <span q-select-value-text></span>
        <button q-select-clear-trigger></button>
        <div q-select-indicator></div>
        <div q-select-error-indicator></div>
      </div>

      <select q-select-hidden-select></select>

      <ng-template qPortal>
        <div q-select-positioner>
          <div q-select-content>
            @for (item of cityCollection.items; track item) {
              <div q-select-item [item]="item">
                <span q-select-item-text>
                  {{ cityCollection.stringifyItem(item) }}
                </span>
                <span q-select-item-indicator></span>
              </div>
            }
          </div>
        </div>
      </ng-template>
    </div>
    <!-- preview -->
  `,
})
export class SelectCompositeDemo {
  cityCollection = selectCollection({
    items: [
      "San Diego",
      "Nashville",
      "Denver",
      "Miami",
      "Las Vegas",
      "New York City",
      "San Francisco",
    ],
  })
}
