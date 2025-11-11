import {computed, Directive, type OnInit} from "@angular/core"

import {CoreMenuSeparatorDirective} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  selector: "[q-menu-separator]",
  standalone: false,
})
export class MenuSeparatorDirective
  extends CoreMenuSeparatorDirective
  implements OnInit
{
  protected readonly qdsMenuContext = useQdsMenuContext()

  override ngOnInit() {
    this.trackBindings({
      extraBindings: computed(() =>
        this.qdsMenuContext().getSeparatorBindings(),
      ),
    })
  }
}
