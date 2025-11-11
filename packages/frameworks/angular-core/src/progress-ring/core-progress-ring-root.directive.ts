import {computed, Directive, inject, Injector, type OnInit} from "@angular/core"

import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {CoreBaseProgressDirective} from "@qualcomm-ui/angular-core/progress"
import {
  createProgressApi,
  type ProgressApiProps,
  progressMachine,
} from "@qualcomm-ui/core/progress"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {ProgressRingContextService} from "./progress-ring-context.service"

@Directive()
export class CoreProgressRingRootDirective
  extends CoreBaseProgressDirective
  implements OnInit
{
  readonly injector = inject(Injector)

  protected readonly progressRingContext = inject(ProgressRingContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.progressRingContext.context().getRootBindings(),
  )

  ngOnInit() {
    const machine = useMachine(
      progressMachine,
      computed<Explicit<ProgressApiProps>>(() => ({
        defaultValue: this.defaultValue(),
        dir: this.dir(),
        ids: undefined,
        invalid: this.invalid(),
        max: this.max(),
        min: this.min(),
        onValueChange: (value) => this.valueChanged.emit(value),
        value: this.value(),
      })),
      this.injector,
    )

    this.progressRingContext.init(
      computed(() => createProgressApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
