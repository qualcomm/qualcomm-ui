import {Component, computed} from "@angular/core"
import {Asterisk} from "lucide-angular"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreSelectLabelDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  providers: [provideIcons({Asterisk})],
  selector: "[q-select-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (selectContext().required) {
      <svg
        qIcon="Asterisk"
        size="xs"
        [q-bind]="qdsInputContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class SelectLabelDirective extends CoreSelectLabelDirective {
  protected readonly qdsInputContext = useQdsInputContext()
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getLabelBindings()),
    )
  }
}
