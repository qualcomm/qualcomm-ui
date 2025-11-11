import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useProgressContext} from "./progress-context.service"

@Directive()
export class CoreProgressHintDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly progressContext = useProgressContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.progressContext().getHintBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
  })

  protected readonly onDestroy = useOnDestroy()

  private readonly hostId = computed(() => useId(this, this.id()))

  ngOnInit() {
    this.trackBindings()
  }
}
