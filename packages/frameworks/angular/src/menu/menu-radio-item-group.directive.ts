import {computed, Directive} from "@angular/core"

import {
  CoreMenuRadioItemGroupDirective,
  provideMenuRadioItemGroupContext,
} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  providers: [provideMenuRadioItemGroupContext()],
  selector: "[q-menu-radio-item-group]",
  standalone: false,
})
export class MenuRadioItemGroupDirective extends CoreMenuRadioItemGroupDirective {
  readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getItemGroupBindings()),
    )
  }
}
