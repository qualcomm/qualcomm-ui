import {computed, Directive} from "@angular/core"

import {CoreSegmentedControlHiddenInputDirective} from "@qualcomm-ui/angular-core/segmented-control"

import {useQdsSegmentedControlContext} from "./qds-segmented-control-context.service.js"

/**
 * The segmented control item hidden input.
 */
@Directive({
  selector: "[q-segmented-control-hidden-input]",
  standalone: false,
})
export class SegmentedControlHiddenInputDirective extends CoreSegmentedControlHiddenInputDirective {
  protected readonly qdsSegmentedControlContext =
    useQdsSegmentedControlContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        this.qdsSegmentedControlContext().getItemHiddenInputBindings(),
      ),
    )
  }
}
