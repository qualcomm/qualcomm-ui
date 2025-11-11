import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useCollapsibleContext} from "./collapsible-context.service"

@Directive()
export class CoreCollapsibleContentDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly collapsibleContext = useCollapsibleContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.collapsibleContext().getContentBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
  })

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly onDestroy = useOnDestroy()

  ngOnInit() {
    this.trackBindings()
  }
}
