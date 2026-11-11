import {Component} from "@angular/core"
import {LucideSearch, LucideX} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideSearch, LucideX})],
  selector: "toolbar",
  template: `
    <button q-icon-button aria-label="Search" icon="Search"></button>
    <button
      q-icon-button
      density="compact"
      variant="ghost"
      icon="X"
      aria-label="Clear the search field"
      size="sm"
    ></button>
  `,
})
export class Toolbar {}
