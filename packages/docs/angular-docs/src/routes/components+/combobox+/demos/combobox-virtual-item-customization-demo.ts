import {Component, type Signal} from "@angular/core"
import {FormsModule} from "@angular/forms"
import {injectQuery} from "@tanstack/angular-query-experimental"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {AngularVirtualizerOptions} from "@qualcomm-ui/angular-core/virtual"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

interface Starship {
  name: string
  url: string
}

@Component({
  imports: [ComboboxModule, FormsModule, ProgressRingModule],
  selector: "combobox-virtual-item-customization-demo",
  template: `
    <!-- preview -->
    <q-combobox
      class="w-56"
      label="Starship"
      placeholder="Search for a Starship"
      [collection]="listCollection.collection()"
      (inputValueChanged)="onInputChange($event)"
    >
      @if (query.isFetching()) {
        <div q-combobox-icon q-progress-ring size="xs"></div>
      }

      <div q-combobox-virtual-content [virtualOptions]="virtualOptions">
        <div q-combobox-empty>No results found</div>

        <ng-container *comboboxVirtualizer="let virtualizer">
          @for (
            virtualItem of virtualizer.getVirtualItems();
            track virtualItem.key
          ) {
            @let item = listCollection.collection().items.at(virtualItem.index);
            <div
              q-combobox-virtual-item
              style="height: 52px"
              [virtualItem]="virtualItem"
            >
              <div class="flex flex-col gap-0.5" q-combobox-item-text>
                <div class="font-body-xs-bold">{{ item!.name }}</div>
                <div class="font-body-xs overflow-x-hidden text-ellipsis">
                  {{ item!.url }}
                </div>
              </div>
              <span q-combobox-item-indicator></span>
            </div>
          }
        </ng-container>
      </div>
    </q-combobox>
    <!-- preview -->
  `,
})
export class ComboboxVirtualItemCustomizationDemo {
  readonly query = injectQuery<Starship[]>(() => ({
    queryFn: async () => {
      return fetch("https://www.swapi.tech/api/starships?page=1&limit=100", {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const data = await res.json()
        return (data.results ?? []) as Starship[]
      })
    },
    queryKey: ["sw-starships"],
    refetchOnWindowFocus: false,
  }))

  readonly virtualOptions: Partial<
    AngularVirtualizerOptions<HTMLDivElement, HTMLDivElement>
  > = {estimateSize: () => 52}

  readonly listCollection = useListCollection<Starship>({
    filter: "contains",
    itemLabel: (item) => item.name,
    items: this.query.data as Signal<Starship[]>,
    itemValue: (item) => item.url,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
