import {JsonPipe} from "@angular/common"
import {Component, signal} from "@angular/core"
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {FormControl, ReactiveFormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule, ReactiveFormsModule, JsonPipe],
  selector: "select-strings-reactive-forms-demo",
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
export class SelectStringsReactiveFormsDemo {
  // preview
  readonly formControl = new FormControl<string[]>(["San Diego"])
  // preview

  cityCollection = selectCollection<string>({
    items: [
      "San Diego",
      "Nashville",
      "Denver",
      "Miami",
      "Las Vegas",
      "New York City",
      "San Francisco",
    ],
  })

  readonly valueSignal = signal<string[]>([])

  constructor() {
    this.valueSignal.set(this.formControl.value ?? [])
    this.formControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.valueSignal.set(value ?? [])
      })
  }
}
