import {Component} from "@angular/core"

import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule],
  selector: "radio-disabled-demo",
  template: `
    <div class="flex flex-col gap-2">
      <div class="text-neutral-primary font-heading-xxs">Disabled</div>
      <form>
        <!-- preview -->
        <fieldset defaultValue="html" disabled name="language" q-radio-group>
          <div q-radio-group-label>Language</div>
          <div q-radio-group-items>
            <label label="HTML" q-radio value="html"></label>
            <label label="CSS" q-radio value="css"></label>
            <label label="TypeScript" q-radio value="ts"></label>
          </div>
        </fieldset>
        <!-- preview -->
      </form>
    </div>
  `,
})
export class RadioDisabledDemo {}
