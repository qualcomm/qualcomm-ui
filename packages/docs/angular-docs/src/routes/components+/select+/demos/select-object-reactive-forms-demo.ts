import {JsonPipe} from "@angular/common"
import {Component, signal} from "@angular/core"
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {FormControl, ReactiveFormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

interface City {
  id: string
  name: string
}

@Component({
  imports: [SelectModule, ReactiveFormsModule, JsonPipe],
  selector: "select-object-reactive-forms-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <output class="text-neutral-primary font-code-sm block">
        {{ valueSignal() | json }}
      </output>
      <q-select
        class="w-48"
        label="City"
        placeholder="Select a city"
        [collection]="cityCollection"
        [formControl]="formControl"
      />
    </div>
  `,
})
export class SelectObjectReactiveFormsDemo {
  // preview
  readonly formControl = new FormControl<City[]>([
    {id: "SD", name: "San Diego"},
  ])
  // preview

  readonly valueSignal = signal<City[]>([])

  cityCollection = selectCollection<City>({
    itemLabel: (item) => item.name,
    items: [
      {id: "SD", name: "San Diego"},
      {id: "NV", name: "Nashville"},
      {id: "DV", name: "Denver"},
      {id: "MI", name: "Miami"},
      {id: "LV", name: "Las Vegas"},
      {id: "NYC", name: "New York City"},
      {id: "SF", name: "San Francisco"},
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
