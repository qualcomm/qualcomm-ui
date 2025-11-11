import {computed, Directive} from "@angular/core"

import {
  CoreMenuRadioItemDirective,
  provideMenuItemContext,
  provideMenuOptionItemContext,
} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  providers: [provideMenuItemContext(), provideMenuOptionItemContext()],
  selector: "[q-menu-radio-item]",
  standalone: false,
})
export class MenuRadioItemDirective extends CoreMenuRadioItemDirective {
  protected readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getItemBindings()),
    )
  }
}
