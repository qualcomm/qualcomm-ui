import {Component, type OnInit} from "@angular/core"
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, ReactiveFormsModule],
  selector: "combobox-reactive-form-states-demo",
  template: `
    <div class="flex w-60 flex-col gap-4">
      <q-combobox
        label="Disabled"
        placeholder="Disabled"
        [collection]="listCollection.collection()"
        [formControl]="disabledField"
        (inputValueChanged)="onInputChange($event)"
      />
      <q-combobox
        label="Required"
        placeholder="Required"
        [collection]="listCollection.collection()"
        [formControl]="requiredField"
        (inputValueChanged)="onInputChange($event)"
      />
      <q-combobox
        label="Invalid"
        placeholder="Invalid"
        [collection]="listCollection.collection()"
        [formControl]="invalidField"
        (inputValueChanged)="onInputChange($event)"
      />
    </div>
  `,
})
export class ComboboxReactiveFormStatesDemo implements OnInit {
  // preview
  disabledField = new FormControl([])
  invalidField = new FormControl([], {
    validators: [Validators.required, Validators.minLength(1)],
  })
  requiredField = new FormControl([], {
    validators: [Validators.required, Validators.minLength(1)],
  })

  ngOnInit() {
    this.disabledField.disable()
    this.invalidField.markAsDirty()
  }
  // preview

  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
