import {Component, computed} from "@angular/core"

import {CoreSelectValueTextDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  selector: "[q-select-value-text]",
  standalone: false,
  template: `
    @if (!value().length) {
      {{ placeholder() }}
    } @else if (!selectContext().multiple) {
      {{ valueAsString() }}
    } @else {
      @for (itemId of value(); track itemId) {
        <button
          emphasis="neutral"
          q-tag
          variant="dismissable"
          (click)="selectContext().selectValue(itemId)"
        >
          {{ selectContext().collection.stringifyItem(itemId) }}
        </button>
      }
    }
  `,
})
export class SelectValueTextDirective extends CoreSelectValueTextDirective {
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getValueTextBindings()),
    )
  }
}
