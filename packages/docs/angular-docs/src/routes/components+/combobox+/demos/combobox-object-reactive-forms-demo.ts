import {JsonPipe} from "@angular/common"
import {Component, signal} from "@angular/core"
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {FormControl, ReactiveFormsModule} from "@angular/forms"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {comboboxCollection} from "@qualcomm-ui/core/combobox"

interface Country {
  id: string
  name: string
}

@Component({
  imports: [ComboboxModule, ReactiveFormsModule, JsonPipe],
  selector: "combobox-object-reactive-forms-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <output class="text-neutral-primary font-code-sm block">
        {{ valueSignal() | json }}
      </output>
      <q-combobox
        class="w-48"
        label="Country"
        placeholder="Select a country"
        [collection]="countryCollection"
        [formControl]="formControl"
      />
    </div>
  `,
})
export class ComboboxObjectReactiveFormsDemo {
  // preview
  readonly formControl = new FormControl<Country[]>([
    {id: "US", name: "United States"},
  ])
  // preview

  readonly valueSignal = signal<Country[]>([])

  readonly countryCollection = comboboxCollection<Country>({
    itemLabel: (item) => item.name,
    items: [
      {id: "US", name: "United States"},
      {id: "CA", name: "Canada"},
      {id: "MX", name: "Mexico"},
      {id: "UK", name: "United Kingdom"},
      {id: "FR", name: "France"},
      {id: "DE", name: "Germany"},
      {id: "JP", name: "Japan"},
    ],
    itemValue: (item) => item.id,
  })

  constructor() {
    this.valueSignal.set(this.formControl.value ?? [])
    this.formControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.valueSignal.set(value ?? [])
      })
  }
}
