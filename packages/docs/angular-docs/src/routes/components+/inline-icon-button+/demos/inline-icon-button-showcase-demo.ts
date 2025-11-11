import {Component} from "@angular/core"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [InlineIconButtonComponent],
  selector: "inline-icon-button-showcase-demo",
  template: `
    <!-- preview -->
    <button q-inline-icon-button></button>
    <!-- preview -->
  `,
})
export class InlineIconButtonShowcaseDemo {}
