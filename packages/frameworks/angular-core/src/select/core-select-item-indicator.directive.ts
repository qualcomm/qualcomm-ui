import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSelectContext} from "./select-context.service"
import {useSelectItemContext} from "./select-item-context.service"

@Directive()
export class CoreSelectItemIndicatorDirective implements OnInit {
  protected readonly selectContext = useSelectContext()
  protected readonly selectItemContext = useSelectItemContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.selectContext().getItemIndicatorBindings(this.selectItemContext()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
