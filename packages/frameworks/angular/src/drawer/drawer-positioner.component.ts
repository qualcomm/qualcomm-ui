import {computed, Directive} from "@angular/core"

import {CoreDialogPositionerDirective} from "@qualcomm-ui/angular-core/dialog"

import {useQdsDrawerContext} from "./qds-drawer-context.service"

/**
 * A container for the drawer content that handles positioning.
 */
@Directive({
  selector: "[q-drawer-positioner]",
  standalone: false,
})
export class DrawerPositionerComponent extends CoreDialogPositionerDirective {
  protected readonly qdsContext = useQdsDrawerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getPositionerBindings()),
    )
  }
}
