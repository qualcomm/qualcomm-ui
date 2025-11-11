import {computed, Directive} from "@angular/core"

import {CoreProgressRingTrackDirective} from "@qualcomm-ui/angular-core/progress-ring"

import {useQdsProgressRingContext} from "./qds-progress-ring-context.service"

@Directive({
  selector: "circle[q-progress-ring-track]",
  standalone: false,
})
export class ProgressRingTrackDirective extends CoreProgressRingTrackDirective {
  protected readonly qdsContext = useQdsProgressRingContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTrackBindings()),
    )
  }
}
