import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useMenuContext} from "./menu-context.service"
import {useMenuItemContext} from "./menu-item-context.service"
import {useMenuOptionItemContext} from "./menu-option-item-context.service"

@Directive()
export class CoreMenuItemIndicatorDirective implements OnInit {
  protected readonly menuContext = useMenuContext()
  protected readonly menuItemContext = useMenuItemContext({optional: true})
  protected readonly menuOptionItemContext = useMenuOptionItemContext({
    optional: true,
  })

  protected readonly trackBindings = useTrackBindings(() => {
    const context = this.menuOptionItemContext?.() || this.menuItemContext?.()
    if (!context) {
      return {}
    }
    return this.menuContext().getItemIndicatorBindings(context)
  })

  ngOnInit() {
    this.trackBindings()
  }
}
