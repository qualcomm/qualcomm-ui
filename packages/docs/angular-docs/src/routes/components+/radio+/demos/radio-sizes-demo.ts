import {Component} from "@angular/core"

import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule],
  selector: "radio-sizes-demo",
  template: `
    <fieldset class="flex flex-col items-center gap-4" q-radio-group>
      <div q-radio-group-items>
        <label label="small (sm)" q-radio size="sm" value="sm"></label>
        <label label="medium (md)" q-radio size="md" value="md"></label>
        <label label="large (lg)" q-radio size="lg" value="lg"></label>
      </div>
    </fieldset>
  `,
})
export class RadioSizesDemo {}
