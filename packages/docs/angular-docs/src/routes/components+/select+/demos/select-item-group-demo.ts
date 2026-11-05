import {Component} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

interface ChipSoftwareProduct {
  name: string
  softwareId: string
  status: "Available" | "Onboarded"
}

const chipSoftwareProducts: ChipSoftwareProduct[] = [
  {
    name: "LINUX.2.0",
    softwareId: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    status: "Available",
  },
  {
    name: "ANDROID.2.0",
    softwareId: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
    status: "Available",
  },
  {
    name: "IOT.2.0",
    softwareId: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
    status: "Available",
  },
  {
    name: "CAMERA.2.0",
    softwareId: "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e",
    status: "Available",
  },
  {
    name: "LINUX.1.0",
    softwareId: "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a",
    status: "Onboarded",
  },
  {
    name: "ANDROID.1.0",
    softwareId: "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
    status: "Onboarded",
  },
]

const collection = selectCollection({
  groupBy: (item) => item.status,
  groupSort: ["Available", "Onboarded"],
  itemDisabled: (item) => item.status === "Onboarded",
  itemLabel: (item) => item.name,
  items: chipSoftwareProducts,
  itemValue: (item) => item.softwareId,
})

@Component({
  imports: [SelectModule, PortalDirective],
  selector: "select-item-group-demo",
  template: `
    <!-- preview -->
    <div
      class="w-80"
      name="chip-software-product"
      placeholder="Select a product"
      q-select-root
      [collection]="collection"
    >
      <label q-select-label>Chip software product</label>
      <div q-select-control>
        <span q-select-value-text></span>
        <button q-select-clear-trigger></button>
        <button q-select-indicator></button>
      </div>
      <select q-select-hidden-select></select>
      <ng-template qPortal>
        <div q-select-positioner>
          <div q-select-content>
            @for (group of collection.group(); track group[0]) {
              <div q-select-item-group>
                <div q-select-item-group-label>{{ group[0] }}</div>
                @for (product of group[1]; track product.softwareId) {
                  <div q-select-item [item]="product">
                    <span q-select-item-text>{{ product.name }}</span>
                    <span q-select-item-indicator></span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </ng-template>
    </div>
    <!-- preview -->
  `,
})
export class SelectItemGroupDemo {
  collection = collection
}
