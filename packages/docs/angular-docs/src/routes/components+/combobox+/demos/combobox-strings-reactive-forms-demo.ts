import {JsonPipe} from "@angular/common"
import {Component, signal} from "@angular/core"
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {FormControl, ReactiveFormsModule} from "@angular/forms"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, ReactiveFormsModule, JsonPipe],
  selector: "combobox-strings-reactive-forms-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <output class="text-neutral-primary font-code-sm block">
        {{ valueSignal() | json }}
      </output>
      <q-combobox
        class="w-48"
        label="Country"
        placeholder="Select a country"
        [collection]="listCollection.collection()"
        [formControl]="formControl"
        (inputValueChanged)="onInputChange($event)"
      />
    </div>
  `,
})
export class ComboboxStringsReactiveFormsDemo {
  // preview
  readonly formControl = new FormControl<string[]>([countries[0]])
  // preview

  readonly valueSignal = signal<string[]>([])

  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  constructor() {
    this.valueSignal.set(this.formControl.value ?? [])
    this.formControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.valueSignal.set(value ?? [])
      })
  }

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
