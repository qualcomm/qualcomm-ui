import {Component, computed} from "@angular/core"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {CoreSelectControlDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  selector: "[q-select-control]",
  standalone: false,
  template: `
    @if (qdsInputContext().startIcon) {
      <svg
        [q-bind]="qdsSelectContext().getIconBindings()"
        [qIcon]="qdsInputContext().startIcon!"
      />
    }
    <ng-content />
  `,
})
export class SelectControlDirective extends CoreSelectControlDirective {
  protected readonly qdsInputContext = useQdsInputContext()
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getControlBindings()),
    )
  }
}
