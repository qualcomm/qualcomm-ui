import {Component} from "@angular/core"

import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule],
  selector: "radio-composite-layout-demo",
  template: `
    <form>
      <!-- preview -->
      <fieldset defaultValue="html" name="language" q-radio-group>
        <div q-radio-group-label>Language</div>
        <div q-radio-group-items>
          <label q-radio-root value="html">
            <input q-radio-hidden-input />
            <span q-radio-label>HTML</span>
            <div q-radio-control></div>
          </label>
          <label q-radio-root value="css">
            <input q-radio-hidden-input />
            <span q-radio-label>CSS</span>
            <div q-radio-control></div>
          </label>
          <label q-radio-root value="ts">
            <input q-radio-hidden-input />
            <span q-radio-label>TypeScript</span>
            <div q-radio-control></div>
          </label>
        </div>
      </fieldset>
      <!-- preview -->
    </form>
  `,
})
export class RadioCompositeLayoutDemo {}
