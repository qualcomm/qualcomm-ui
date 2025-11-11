import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useComboboxContext} from "./combobox-context.service"
import {useComboboxItemContext} from "./combobox-item-context.service"

@Directive()
export class CoreComboboxItemIndicatorDirective implements OnInit {
  protected readonly comboboxContext = useComboboxContext()
  protected readonly itemContext = useComboboxItemContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext().getItemIndicatorBindings(this.itemContext()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
