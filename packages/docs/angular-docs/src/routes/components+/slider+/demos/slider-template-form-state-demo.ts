import {Component} from "@angular/core"

import {SliderModule} from "@qualcomm-ui/angular/slider"

@Component({
  imports: [SliderModule],
  selector: "slider-template-form-state-demo",
  template: `
    <div class="flex flex-col gap-4 sm:w-80">
      <!-- eslint-disable @angular-eslint/template/attributes-order -->
      <!-- preview -->
      <q-slider disabled label="Disabled" [defaultValue]="[25]" />
      <q-slider readOnly label="Read only" [defaultValue]="[25]" />
      <q-slider invalid label="Invalid" [defaultValue]="[25]" />
      <!-- preview -->
    </div>
  `,
})
export class SliderTemplateFormStateDemo {}
