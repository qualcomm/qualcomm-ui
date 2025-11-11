import {computed, Directive, inject, Injector, type OnInit} from "@angular/core"

import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {
  createProgressApi,
  type ProgressApiProps,
  progressMachine,
} from "@qualcomm-ui/core/progress"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {CoreBaseProgressDirective} from "./core-base-progress.directive"
import {ProgressContextService} from "./progress-context.service"

@Directive()
export class CoreProgressRootDirective
  extends CoreBaseProgressDirective
  implements OnInit
{
  readonly injector = inject(Injector)

  protected readonly progressContext = inject(ProgressContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.progressContext.context().getRootBindings(),
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

    this.progressContext.init(
      computed(() => createProgressApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
