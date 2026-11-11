import {Component} from "@angular/core"
import {LucideSearch, LucideX} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideX})],
  selector: "inline-icon-button-demo",
  template: `
    <button
      aria-label="Close the dialog"
      emphasis="neutral"
      q-icon-button
      density="compact"
      variant="ghost"
      icon="X"
    ></button>
    <button
      aria-label="Search"
      emphasis="persistent-white"
      q-icon-button
      density="compact"
      size="sm"
      variant="ghost"
      [icon]="LucideSearch"
    ></button>
    @if (removable) {
      <button
        aria-label="Remove"
        icon="Trash"
        q-icon-button
        density="compact"
        variant="ghost"
      ></button>
    }
  `,
})
export class InlineIconButtonDemo {
  protected readonly LucideSearch = LucideSearch
  protected removable = true
  protected scale = false
}
