import {Component, type OnInit} from "@angular/core"
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule, ReactiveFormsModule],
  selector: "select-reactive-form-states-demo",
  template: `
    <div class="flex w-60 flex-col gap-4">
      <q-select
        label="Disabled"
        placeholder="Disabled"
        [collection]="cityCollection"
        [formControl]="disabledField"
      />
      <q-select
        label="Required"
        placeholder="Required"
        [collection]="cityCollection"
        [formControl]="requiredField"
      />
      <q-select
        label="Invalid"
        placeholder="Invalid"
        [collection]="cityCollection"
        [formControl]="invalidField"
      />
    </div>
  `,
})
export class SelectReactiveFormStatesDemo implements OnInit {
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

  cityCollection = selectCollection({
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
}
