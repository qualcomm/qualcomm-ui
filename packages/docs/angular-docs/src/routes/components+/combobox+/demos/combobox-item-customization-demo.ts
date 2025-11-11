import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"
import {Apple, Banana, Grape, Hamburger, IceCream, Salad} from "lucide-angular"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

interface Food {
  disabled?: boolean | undefined
  icon: LucideIcon
  id: string
  name: string
}

@Component({
  imports: [ComboboxModule, IconDirective, FormsModule],
  selector: "combobox-item-customization-demo",
  template: `
    <!-- preview -->
    <q-combobox
      class="w-56"
      label="Country"
      placeholder="Select a country"
      [collection]="listCollection.collection()"
      [icon]="valueIcon()"
      [(ngModel)]="value"
      (inputValueChanged)="onInputChange($event)"
    >
      <div q-combobox-content>
        <div q-combobox-empty>No results found</div>
        @for (
          item of listCollection.collection().items;
          track listCollection.collection().getItemValue(item)
        ) {
          <div q-combobox-item [item]="item">
            <svg [qIcon]="item.icon"></svg>
            <span q-combobox-item-text>
              {{ listCollection.collection().stringifyItem(item) }}
            </span>
            <span q-combobox-item-indicator></span>
          </div>
        }
      </div>
    </q-combobox>
    <!-- preview -->
  `,
})
export class ComboboxItemCustomizationDemo {
  readonly value = signal<Food[]>([])
  readonly valueIcon = computed(() => this.value().at(0)?.icon)

  listCollection = useListCollection<Food>({
    filter: "contains",
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

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
