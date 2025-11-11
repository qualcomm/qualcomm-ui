import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {PresenceContextService} from "@qualcomm-ui/angular-core/presence"

import {useMenuContext} from "./menu-context.service"

@Directive()
export class CoreMenuTriggerDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly menuContext = useMenuContext()
  protected readonly presenceService = inject(PresenceContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.menuContext().getTriggerBindings({
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
