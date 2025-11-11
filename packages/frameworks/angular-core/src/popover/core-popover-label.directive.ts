import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {usePopoverContext} from "./popover-context.service"

@Directive()
export class CorePopoverLabelDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  private readonly hostId = computed(() => useId(this, this.id()))

  private readonly popoverContext = usePopoverContext()

  private readonly onDestroy = useOnDestroy()

  private readonly trackBindings = useTrackBindings(() =>
    this.popoverContext().getLabelBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
