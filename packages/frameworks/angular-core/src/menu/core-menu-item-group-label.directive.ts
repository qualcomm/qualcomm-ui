import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useMenuContext} from "./menu-context.service"
import {useMenuItemGroupContext} from "./menu-item-group-context.service"
import {useMenuRadioItemGroupContext} from "./menu-radio-item-group-context.service"

@Directive()
export class CoreMenuItemGroupLabelDirective implements OnInit {
  protected readonly menuContext = useMenuContext()
  protected readonly menuItemGroupContext = useMenuItemGroupContext({
    optional: true,
  })
  protected readonly menuRadioItemGroupContext = useMenuRadioItemGroupContext({
    optional: true,
  })

  protected readonly trackBindings = useTrackBindings(() => {
    return this.menuContext().getItemGroupLabelBindings({
      htmlFor:
        this.menuItemGroupContext?.().id ||
        this.menuRadioItemGroupContext?.().id,
    })
  })

  ngOnInit() {
    this.trackBindings()
  }
}
