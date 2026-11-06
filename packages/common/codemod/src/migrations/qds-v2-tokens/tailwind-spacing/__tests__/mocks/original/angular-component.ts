import {Component} from "@angular/core"

@Component({
  host: {class: "flex gap-qds-40"},
  selector: "app-card",
  template: `
    <div
      class="size-qds-140 p-qds-100"
      [class.mt-qds-70]="spaced"
      [ngClass]="{'w-qds-170': wide, 'h-qds-90': !wide}"
    ></div>
  `,
})
export class Card {
  spaced = true
  wide = false
}
