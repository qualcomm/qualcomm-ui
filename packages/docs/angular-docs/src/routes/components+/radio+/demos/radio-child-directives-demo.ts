import {Component} from "@angular/core"

import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule],
  selector: "radio-child-directives-demo",
  template: `
    <form>
      <!-- preview -->
      <fieldset defaultValue="html" name="language" q-radio-group>
        <div q-radio-group-label>Language</div>
        <div q-radio-group-items>
          <label q-radio value="html">
            <div q-radio-label>HTML</div>
          </label>
          <label q-radio value="css">
            <div q-radio-label>CSS</div>
          </label>
          <label q-radio value="ts">
            <div q-radio-label>TypeScript</div>
          </label>
        </div>
      </fieldset>
      <!-- preview -->
    </form>
  `,
})
export class RadioChildDirectivesDemo {}
