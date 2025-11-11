import {Component, computed} from "@angular/core"
import {Asterisk} from "lucide-angular"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {CoreComboboxLabelDirective} from "@qualcomm-ui/angular-core/combobox"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Component({
  providers: [provideIcons({Asterisk})],
  selector: "[q-combobox-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (comboboxContext().required) {
      <svg
        qIcon="Asterisk"
        size="xs"
        [q-bind]="qdsInputContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class ComboboxLabelDirective extends CoreComboboxLabelDirective {
  protected readonly qdsInputContext = useQdsInputContext()
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getLabelBindings()),
    )
  }
}
