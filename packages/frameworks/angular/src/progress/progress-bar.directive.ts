import {computed, Directive} from "@angular/core"

import {CoreProgressBarDirective} from "@qualcomm-ui/angular-core/progress"

import {useQdsProgressContext} from "./qds-progress-context.service"

@Directive({
  selector: "[q-progress-bar]",
  standalone: false,
})
export class ProgressBarDirective extends CoreProgressBarDirective {
  protected qdsContext = useQdsProgressContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBarBindings()),
    )
  }
}
