import {Component} from "@angular/core"

import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule],
  selector: "radio-simple-demo",
  template: `
    <form>
      <!-- preview -->
      <fieldset defaultValue="html" name="language" q-radio-group>
        <div q-radio-group-label>Language</div>
        <div q-radio-group-items>
          <label label="HTML" q-radio value="html"></label>
          <label label="CSS" q-radio value="css"></label>
          <label label="TypeScript" q-radio value="ts"></label>
        </div>
      </fieldset>
      <!-- preview -->
    </form>
  `,
})
export class RadioSimpleDemo {}
