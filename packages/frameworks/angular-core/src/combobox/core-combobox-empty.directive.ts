import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useComboboxContext} from "./combobox-context.service"

@Directive()
export class CoreComboboxEmptyDirective implements OnInit {
  protected readonly comboboxContext = useComboboxContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext().getEmptyBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
