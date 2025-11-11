import {Directive, type OnInit} from "@angular/core"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

@Directive({
  selector: "[q-combobox-icon]",
  standalone: false,
})
export class ComboboxIconDirective implements OnInit {
  protected readonly qdsInputContext = useQdsInputContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsInputContext().getStartIconBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
