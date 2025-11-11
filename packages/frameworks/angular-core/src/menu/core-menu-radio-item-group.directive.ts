import {
  computed,
  Directive,
  inject,
  input,
  model,
  type OnInit,
} from "@angular/core"

import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {useControlledState} from "@qualcomm-ui/angular-core/state"
import type {ItemGroupContext} from "@qualcomm-ui/core/menu"

import {useMenuContext} from "./menu-context.service"
import {MenuRadioItemGroupContextService} from "./menu-radio-item-group-context.service"

@Directive()
export class CoreMenuRadioItemGroupDirective
  implements SignalifyInput<Partial<ItemGroupContext>>, OnInit
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly menuContext = useMenuContext()
  protected readonly radioItemGroupService = inject(
    MenuRadioItemGroupContextService,
  )

  /**
   * The initial value of the radio item group.
   * Use when you don't need to control the state of the group.
   */
  readonly defaultValue = input<string>()

  /**
   * The controlled value of the radio item group.
   */
  readonly value = model<string | undefined>()

  readonly valueState = useControlledState<string | undefined>({
    defaultValue: this.defaultValue,
    onChange: (value) => this.value.set(value),
    value: this.value,
  })

  protected readonly trackBindings = useTrackBindings(() => {
    return this.menuContext().getItemGroupBindings({
      id: this.hostId(),
    })
  })

  private readonly hostId = computed(() => useId(this, this.id()))

  ngOnInit() {
    this.radioItemGroupService.init(
      computed(() => ({
        id: this.hostId(),
        onValueChange: (value) => this.valueState().setValue(value),
        value: this.valueState().value(),
      })),
    )

    this.trackBindings()
  }
}
