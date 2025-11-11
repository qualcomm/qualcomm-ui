import {DOCUMENT} from "@angular/common"
import {computed, Directive, inject, Injector} from "@angular/core"

import {CoreAccordionItemContentDirective} from "@qualcomm-ui/angular-core/accordion"
import {CollapsibleContextService} from "@qualcomm-ui/angular-core/collapsible"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {
  type CollapsibleApiProps,
  collapsibleMachine,
  createCollapsibleApi,
} from "@qualcomm-ui/core/collapsible"
import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"
import {collapsibleClasses} from "@qualcomm-ui/qds-core/collapsible"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

@Directive({
  selector: "[q-accordion-item-content-animator]",
  standalone: false,
})
export class AccordionItemContentAnimatorComponent extends CoreAccordionItemContentDirective {
  private readonly injector = inject(Injector)
  private readonly document = inject(DOCUMENT)

  readonly collapsibleService = inject(CollapsibleContextService)

  protected override readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.accordionContext().getAccordionItemContentBindings({
        disabled: this.accordionItemContext().disabled,
        id: this.hostId(),
        onDestroy: this.onDestroy,
        value: this.accordionItemContext().value,
      }),
      this.collapsibleService.context().getRootBindings(),
      this.collapsibleService.context().getContentBindings({
        id: this.hostId(),
      }),
      {class: collapsibleClasses.content},
      {class: accordionClasses.itemContentAnimator},
    ),
  )

  override ngOnInit() {
    super.ngOnInit()

    const machine = useMachine(
      collapsibleMachine,
      computed<CollapsibleApiProps>(() => ({
        defaultOpen: false,
        disabled: this.accordionItemContext().disabled,
        forceMeasureOnOpen: true,
        getRootNode: () => this.document,
        open: this.accordionContext().value.includes(
          this.accordionItemContext().value,
        ),
      })),
      this.injector,
    )

    const collapsibleApi = computed(() =>
      createCollapsibleApi(machine, normalizeProps),
    )

    this.collapsibleService.init(collapsibleApi)

    this.trackBindings()
  }
}
