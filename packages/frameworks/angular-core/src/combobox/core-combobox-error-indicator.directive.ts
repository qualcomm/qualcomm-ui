import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useComboboxContext} from "./combobox-context.service"

@Directive()
export class CoreComboboxErrorIndicatorDirective implements OnInit {
  protected readonly comboboxContext = useComboboxContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext().getErrorIndicatorBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
