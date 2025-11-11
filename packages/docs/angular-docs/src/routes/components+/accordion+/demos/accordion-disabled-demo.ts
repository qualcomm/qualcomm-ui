import {Component, signal} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"
import {ButtonModule} from "@qualcomm-ui/angular/button"

const loremIpsum =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor"

export const items: {
  content: string
  disabled?: boolean
  secondaryText: string
  text: string
  value: string
}[] = [
  {
    content: loremIpsum,
    secondaryText: "Secondary text",
    text: "Accordion Text 1",
    value: "a",
  },
  {
    content: loremIpsum,
    disabled: true,
    secondaryText: "Secondary text",
    text: "Accordion Text 2",
    value: "b",
  },
  {
    content: loremIpsum,
    secondaryText: "Secondary text",
    text: "Accordion Text 3",
    value: "c",
  },
]

@Component({
  imports: [AccordionModule, ButtonModule],
  selector: "accordion-disabled-demo",
  template: `
    <div class="flex w-96 flex-col items-center gap-4">
      <!-- preview -->
      <div class="w-full" q-accordion [disabled]="disabled()">
        @for (item of items; track item.value; let i = $index) {
          <div
            q-accordion-item
            [disabled]="item.disabled"
            [text]="item.text"
            [value]="item.value"
          >
            {{ item.content }}
          </div>
        }
      </div>
      <!-- preview -->
      <button
        emphasis="primary"
        q-button
        variant="fill"
        (click)="disabled.set(!disabled())"
      >
        {{ disabled() ? "Enable" : "Disable" }} accordion
      </button>
    </div>
  `,
})
export class AccordionDisabledDemo {
  readonly items = items
  readonly disabled = signal(false)
}
