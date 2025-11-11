import {Component, computed} from "@angular/core"

import {CoreSelectHiddenSelectDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  selector: "select[q-select-hidden-select]",
  standalone: false,
  template: `
    @if (selectContext().empty) {
      <option value=""></option>
    }
    @for (opt of selectContext().hiddenSelectOptions; track opt.value) {
      <option [disabled]="opt.disabled" [value]="opt.value">
        {{ opt.label }}
      </option>
    }
  `,
})
export class SelectHiddenSelectDirective extends CoreSelectHiddenSelectDirective {
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getHiddenSelectBindings()),
    )
  }
}
