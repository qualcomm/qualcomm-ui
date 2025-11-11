import {Component, signal} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"

import {items} from "./accordion-example-data"

@Component({
  imports: [AccordionModule],
  selector: "accordion-focus-callback-demo",
  standalone: true,
  template: `
    <div class="w-96">
      <!-- preview -->
      <div
        multiple
        q-accordion
        [defaultValue]="['a']"
        (focusChanged)="currentValue.set($event || '')"
      >
        @for (item of items; track item.value) {
          <div q-accordion-item [text]="item.text" [value]="item.value">
            {{ item.content }}
          </div>
        }
      </div>
      <!-- preview -->
      <output class="font-body-sm text-neutral-primary mt-4 block">
        currently focused:
        <strong>{{ currentValue() || "none" }}</strong>
      </output>
    </div>
  `,
})
export class AccordionFocusCallbackDemo {
  readonly items = items
  readonly currentValue = signal<string>("")
}
