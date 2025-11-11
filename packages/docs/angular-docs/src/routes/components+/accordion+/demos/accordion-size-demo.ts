import {Component, signal} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"
import {RadioModule} from "@qualcomm-ui/angular/radio"
import type {QdsAccordionSize} from "@qualcomm-ui/qds-core/accordion"

import {items} from "./accordion-example-data"

@Component({
  imports: [AccordionModule, RadioModule],
  selector: "accordion-size-demo",
  template: `
    <div class="flex w-96 flex-col items-center gap-8">
      <!-- preview -->
      <div class="w-full" q-accordion [size]="size()">
        @for (item of items; track item.value) {
          <div q-accordion-item [text]="item.text" [value]="item.value">
            {{ item.content }}
          </div>
        }
      </div>
      <!-- preview -->
      <fieldset
        defaultValue="md"
        name="size"
        orientation="horizontal"
        q-radio-group
        (valueChanged)="onSizeChanged($event!)"
      >
        <div q-radio-group-items>
          <label label="Small" q-radio value="sm"></label>
          <label label="Medium" q-radio value="md"></label>
          <label label="Large" q-radio value="lg"></label>
        </div>
      </fieldset>
    </div>
  `,
})
export class AccordionSizeDemo {
  readonly items = items
  readonly size = signal<QdsAccordionSize>("md")
  onSizeChanged(value: string) {
    this.size.set(value as QdsAccordionSize)
  }
}
