import {Component} from "@angular/core"
import {LucideSearch} from "@lucide/angular"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [InlineIconButtonComponent],
  selector: "inline-icon-button-demo",
  template: `
    <button
      aria-label="Close the dialog"
      emphasis="neutral"
      q-inline-icon-button
    ></button>
    <button
      aria-label="Search"
      emphasis="persistent-white"
      q-inline-icon-button
      size="sm"
      variant="scale"
      [icon]="LucideSearch"
    ></button>
    @if (removable) {
      <button
        aria-label="Remove"
        icon="Trash"
        q-inline-icon-button
        [variant]="scale ? 'scale' : 'fixed'"
      ></button>
    }
  `,
})
export class InlineIconButtonDemo {
  protected readonly LucideSearch = LucideSearch
  protected removable = true
  protected scale = false
}
