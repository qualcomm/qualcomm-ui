import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {ItemProps} from "@qualcomm-ui/core/select"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {useSelectContext} from "./select-context.service"
import {SelectItemContextService} from "./select-item-context.service"

@Directive()
export class CoreSelectItemDirective
  implements SignalifyInput<ItemProps>, OnInit
{
  /**
   * The item to render, from the collection
   */
  readonly item = input<CollectionItem>()

  /**
   * Whether hovering outside should clear the highlighted state
   */
  readonly persistFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly selectContext = useSelectContext()

  protected readonly selectItemService = inject(SelectItemContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.selectContext().getItemBindings(this.selectItemService.context()),
  )

  ngOnInit() {
    this.selectItemService.init(
      computed(() =>
        this.selectContext().getItemState({
          item: this.item(),
          persistFocus: this.persistFocus(),
        } satisfies Explicit<ItemProps>),
      ),
    )

    this.trackBindings()
  }
}
