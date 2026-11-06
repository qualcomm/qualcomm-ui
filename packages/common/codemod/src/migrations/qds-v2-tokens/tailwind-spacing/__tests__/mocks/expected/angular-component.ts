import {Component} from "@angular/core"

@Component({
  host: {class: "flex gap-qds-100"},
  selector: "app-card",
  template: `
    <div
      class="size-qds-800 p-qds-400"
      [class.mt-qds-200]="spaced"
      [ngClass]="{'w-qds-1100': wide, 'h-qds-300': !wide}"
    ></div>
  `,
})
export class Card {
  spaced = true
  wide = false
}
