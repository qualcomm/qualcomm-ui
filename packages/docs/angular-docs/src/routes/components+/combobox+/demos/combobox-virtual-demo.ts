import {Component, computed} from "@angular/core"
import {injectQuery} from "@tanstack/angular-query-experimental"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

// TODO: virtual prop not yet implemented in Angular
@Component({
  imports: [ComboboxModule],
  selector: "combobox-virtual-demo",
  template: `
    <!-- preview -->
    <q-combobox
      class="w-56"
      label="Country"
      placeholder="Select a country"
      virtual
      [collection]="listCollection.collection()"
      (inputValueChanged)="onInputChange($event)"
    />
    <!-- preview -->
  `,
})
export class ComboboxVirtualDemo {
  readonly query = injectQuery<string[]>(() => ({
    queryFn: async () => {
      return fetch("/get-mock-user-data", {
        body: JSON.stringify({count: 5000}),
        headers: {"Content-Type": "application/json"},
        method: "POST",
      }).then((res) => res.json())
    },
    queryKey: ["mock-users", 5000],
    refetchOnWindowFocus: false,
  }))

  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: computed(() => this.query.data() || []),
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
