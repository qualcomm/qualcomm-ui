import {computed, Directive} from "@angular/core"

import {CoreDialogContentDirective} from "@qualcomm-ui/angular-core/dialog"

import {useQdsDrawerContext} from "./qds-drawer-context.service"

/**
 * A container for the drawer contents.
 */
@Directive({
  selector: "[q-drawer-content]",
  standalone: false,
})
export class DrawerContentDirective extends CoreDialogContentDirective {
  protected readonly qdsContext = useQdsDrawerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getContentBindings()),
    )
  }
}
