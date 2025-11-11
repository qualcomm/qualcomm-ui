import {Component} from "@angular/core"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule],
  selector: "text-input-states-demo",
  template: `
    <div class="flex w-60 flex-col gap-4">
      <!-- preview -->
      <q-text-input disabled label="Disabled" placeholder="Disabled" />
      <q-text-input label="Read only" placeholder="Read only" readOnly />
      <q-text-input
        errorText="Invalid"
        invalid
        label="Invalid"
        placeholder="Invalid"
      />
      <!-- preview -->
    </div>
  `,
})
export class TextInputStatesDemo {}
