import {Component} from "@angular/core"
import {LucideSearch} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [ButtonModule, InlineIconButtonComponent],
  providers: [provideIcons({LucideSearch})],
  selector: "toolbar",
  template: `
    <button q-icon-button aria-label="Search" icon="Search"></button>
    <button
      q-inline-icon-button
      aria-label="Clear the search field"
      size="sm"
    ></button>
  `,
})
export class Toolbar {}
