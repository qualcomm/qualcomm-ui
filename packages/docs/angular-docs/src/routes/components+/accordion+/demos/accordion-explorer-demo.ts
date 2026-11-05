import {Component} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"

@Component({
  imports: [AccordionModule],
  selector: "accordion-explorer-demo",
  template: `
    <!-- preview -->
    <div class="w-96" q-accordion [defaultValue]="['a']">
      <div
        q-accordion-item
        secondaryText="Secondary text"
        text="Accordion Item 1"
        value="a"
      >
        Content for the first accordion item.
      </div>
      <div
        q-accordion-item
        secondaryText="Secondary text"
        text="Accordion Item 2"
        value="b"
      >
        Content for the second accordion item.
      </div>
    </div>
    <!-- preview -->
  `,
})
export class AccordionExplorerDemo {}
