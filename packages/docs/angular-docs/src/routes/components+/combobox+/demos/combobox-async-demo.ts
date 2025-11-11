import {Component, type Signal} from "@angular/core"
import {injectQuery} from "@tanstack/angular-query-experimental"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

interface Starship {
  name: string
  url: string
}

@Component({
  imports: [ComboboxModule, ProgressRingModule],
  selector: "combobox-async-demo",
  template: `
    <!-- preview -->
    <q-combobox
      class="w-56"
      label="Country"
      placeholder="Select a country"
      [collection]="listCollection.collection()"
      (inputValueChanged)="onInputChange($event)"
    >
      @if (query.isFetching()) {
        <div q-combobox-icon q-progress-ring size="xs"></div>
      }
    </q-combobox>
    <!-- preview -->
  `,
})
export class ComboboxAsyncDemo {
  readonly query = injectQuery<Starship[]>(() => ({
    queryFn: async () => {
      return fetch("https://www.swapi.tech/api/sharships?page=1&limit=100", {
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
