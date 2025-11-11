import {computed, Directive} from "@angular/core"

import {CoreProgressHintDirective} from "@qualcomm-ui/angular-core/progress"

import {useQdsProgressContext} from "./qds-progress-context.service"

@Directive({
  selector: "[q-progress-hint]",
  standalone: false,
})
export class ProgressHintDirective extends CoreProgressHintDirective {
  protected qdsContext = useQdsProgressContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getHintBindings()),
    )
  }
}
