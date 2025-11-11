import {Component} from "@angular/core"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule],
  selector: "number-input-states-demo",
  template: `
    <div class="flex w-60 flex-col gap-4">
      <!-- preview -->
      <q-number-input disabled label="Disabled" placeholder="Disabled" />
      <q-number-input label="Read only" placeholder="Read only" readOnly />
      <q-number-input
        errorText="Invalid"
        invalid
        label="Invalid"
        placeholder="Invalid"
      />
      <!-- preview -->
    </div>
  `,
})
export class NumberInputStatesDemo {}
