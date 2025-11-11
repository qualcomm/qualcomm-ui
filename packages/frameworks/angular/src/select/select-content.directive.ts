import {computed, Directive} from "@angular/core"

import {CoreSelectContentDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Directive({
  selector: "[q-select-content]",
  standalone: false,
})
export class SelectContentDirective extends CoreSelectContentDirective {
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getContentBindings()),
    )
  }
}
