import {computed, Directive} from "@angular/core"

import {CoreMenuContentDirective} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  selector: "[q-menu-content]",
  standalone: false,
})
export class MenuContentDirective extends CoreMenuContentDirective {
  protected readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getContentBindings()),
    )
  }
}
