import {Component} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule, FormsModule],
  selector: "radio-orientation-demo",
  template: `
    <form>
      <!-- preview -->
      <fieldset name="language" orientation="horizontal" q-radio-group>
        <div q-radio-group-label>Language</div>
        <div q-radio-group-items>
          <label label="HTML" q-radio value="html"></label>
          <label label="CSS" q-radio value="css"></label>
          <label label="TypeScript" q-radio value="ts"></label>
        </div>
        <div q-radio-group-error-text>You must select a value</div>
      </fieldset>
      <!-- preview -->
    </form>
  `,
})
export class RadioOrientationDemo {}
