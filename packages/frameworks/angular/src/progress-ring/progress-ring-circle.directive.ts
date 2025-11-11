import {Component, computed} from "@angular/core"

import {CoreProgressRingCircleDirective} from "@qualcomm-ui/angular-core/progress-ring"

import {useQdsProgressRingContext} from "./qds-progress-ring-context.service"

@Component({
  selector: "svg[q-progress-ring-circle]",
  standalone: false,
  template: `
    <ng-content>
      <svg:circle q-progress-ring-track />
      <svg:circle q-progress-ring-bar />
    </ng-content>
  `,
})
export class ProgressRingCircleDirective extends CoreProgressRingCircleDirective {
  protected readonly qdsContext = useQdsProgressRingContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getCircleBindings()),
    )
  }
}
