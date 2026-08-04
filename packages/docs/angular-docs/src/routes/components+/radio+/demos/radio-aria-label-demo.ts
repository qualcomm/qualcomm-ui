import {Component} from "@angular/core"

import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule],
  selector: "radio-aria-label-demo",
  template: `
    <form>
      <!-- preview -->
      <fieldset defaultValue="email" name="notification" q-radio-group>
        <div q-radio-group-label>Notification preference</div>
        <div q-radio-group-items>
          <label aria-label="Email" q-radio value="email"></label>
          <label aria-label="SMS" q-radio value="sms"></label>
          <label aria-label="Push" q-radio value="push"></label>
        </div>
      </fieldset>
      <!-- preview -->
    </form>
  `,
})
export class RadioAriaLabelDemo {}
