import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {usePresenceRenderer} from "@qualcomm-ui/angular-core/presence"

import {useDialogContext} from "./dialog-context.service"

@Directive()
export class CoreDialogPositionerDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly dialogContext = useDialogContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.dialogContext().getPositionerBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  protected readonly onDestroy = useOnDestroy()

  private readonly hostId = computed(() => useId(this, this.id()))

  presenceRendererEffect = usePresenceRenderer()

  ngOnInit() {
    this.trackBindings()
  }
}
