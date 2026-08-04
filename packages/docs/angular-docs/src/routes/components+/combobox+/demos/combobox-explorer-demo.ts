import {Component} from "@angular/core"

import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import {ComboboxModule} from "@qualcomm-ui/angular/combobox"

@Component({
  imports: [ComboboxModule],
  selector: "combobox-explorer-demo",
  template: `
    <q-combobox
      class="w-48"
      defaultOpen
      disablePortal
      hint="Choose a framework"
      label="Framework"
      placeholder="Select a framework"
      [collection]="listCollection.collection()"
      [defaultValue]="['React']"
    />
  `,
})
export class ComboboxExplorerDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: ["React", "Angular", "Vue"],
  })
}
