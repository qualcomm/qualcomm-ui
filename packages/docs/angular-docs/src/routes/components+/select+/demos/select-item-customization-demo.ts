import {Component, computed, signal} from "@angular/core"
import {Apple, Banana, Grape, Hamburger, IceCream, Salad} from "lucide-angular"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {SelectModule} from "@qualcomm-ui/angular/select"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {selectCollection} from "@qualcomm-ui/core/select"

interface Food {
  disabled?: boolean | undefined
  icon: LucideIcon
  id: string
  name: string
}

@Component({
  imports: [SelectModule, IconDirective],
  selector: "select-item-customization-demo",
  template: `
    <!-- preview -->
    <q-select
      class="w-48"
      label="Food"
      [collection]="cityCollection"
      [icon]="valueIcon()"
      (valueChanged)="value.set($event.items)"
    >
      <div q-select-content>
        @for (
          item of cityCollection.items;
          track cityCollection.getItemValue(item)
        ) {
          <div q-select-item [item]="item">
            <svg [qIcon]="item.icon"></svg>
            <span q-select-item-text>
              {{ cityCollection.stringifyItem(item) }}
            </span>
            <span q-select-item-indicator></span>
          </div>
        }
      </div>
    </q-select>
    <!-- preview -->
  `,
})
export class SelectItemCustomizationDemo {
  readonly value = signal<Food[]>([])
  readonly valueIcon = computed(() => this.value().at(0)?.icon)

  cityCollection = selectCollection<Food>({
    itemDisabled: (item) => item.disabled,
    itemLabel: (item) => item.name,
    items: [
      {icon: Grape, id: "grape", name: "Grape"},
      {icon: Banana, id: "banana", name: "Banana"},
      {disabled: true, icon: Apple, id: "apple", name: "Apple"},
      {icon: IceCream, id: "ice-cream", name: "Ice Cream"},
      {icon: Hamburger, id: "hamburger", name: "Hamburger"},
      {icon: Salad, id: "salad", name: "Salad"},
    ],
    itemValue: (item) => item.id,
  })
}
