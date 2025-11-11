import {
  computed,
  Directive,
  inject,
  Injector,
  type OnInit,
  untracked,
} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useMachine} from "@qualcomm-ui/angular-core/machine"
import {
  PresenceContextService,
  RenderStrategyContextService,
  usePresenceRenderer,
} from "@qualcomm-ui/angular-core/presence"
import {createPresenceApi, presenceMachine} from "@qualcomm-ui/core/presence"

import {useDialogContext} from "./dialog-context.service"

@Directive()
export class CoreDialogBackdropDirective implements OnInit {
  protected readonly dialogContext = useDialogContext()
  protected readonly parentRenderStrategyContext = inject(
    RenderStrategyContextService,
    {skipSelf: true},
  )

  protected readonly presenceContext = inject(PresenceContextService, {
    self: true,
  })

  protected readonly dialogBackdropProps = computed(() => {
    const props = untracked(() =>
      this.dialogContext().getBackdropBindings({
        id: this.id(),
        onDestroy: this.onDestroy,
      }),
    )
    return {
      ...props,
      ...this.presenceContext.getPresenceBindings(),
    }
  })

  protected readonly id = computed(() => useId(this, null))

  private readonly injector = inject(Injector)

  protected readonly onDestroy = useOnDestroy()

  protected readonly presenceRendererEffect = usePresenceRenderer({
    injectOptions: {self: true},
  })

  ngOnInit() {
    const machine = useMachine(
      presenceMachine,
      computed(() => ({
        lazyMount: this.parentRenderStrategyContext.context().lazyMount,
        present: this.dialogContext().open,
        unmountOnExit: this.parentRenderStrategyContext.context().unmountOnExit,
      })),
      this.injector,
    )

    this.presenceContext.init(computed(() => createPresenceApi(machine)))
  }
}
