import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  selector: "[q-menu-item-command]",
  standalone: false,
})
export class MenuItemCommandDirective implements OnInit {
  readonly qdsMenuContext = useQdsMenuContext()

  readonly trackBindings = useTrackBindings(() =>
    this.qdsMenuContext().getItemCommandBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
