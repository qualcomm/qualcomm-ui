import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {useControlledState} from "@qualcomm-ui/angular-core/state"
import type {OptionItemProps} from "@qualcomm-ui/core/menu"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {BaseMenuItemDirective} from "./base-menu-item.directive"
import {MenuOptionItemContextService} from "./menu-option-item-context.service"

@Directive()
export class CoreMenuCheckboxItemDirective
  extends BaseMenuItemDirective
  implements SignalifyInput<Omit<OptionItemProps, "type">>, OnInit
{
  readonly checked = input<boolean>()

  readonly defaultChecked = input<boolean | undefined, Booleanish>(false, {
    transform: booleanAttribute,
  })

  readonly checkedChanged = output<boolean | undefined>()

  protected readonly menuOptionItemService = inject(
    MenuOptionItemContextService,
  )

  readonly optionItemProps = computed<OptionItemProps>(() => {
    const props = this.itemProps()
    return {
      ...props,
      checked: this.checkedState().value(),
      onCheckedChange: (value) => this.checkedState().setValue(value),
      type: "checkbox",
    }
  })

  protected readonly trackBindings = useTrackBindings(() => {
    return this.menuContext().getOptionItemBindings(this.optionItemProps())
  })

  private readonly checkedState = useControlledState<boolean>({
    defaultValue: this.defaultChecked,
    onChange: (value) => this.checkedChanged.emit(value),
    value: this.checked,
  })

  readonly optionItemState = computed(() => {
    const optionItemProps = this.optionItemProps()
    return {
      ...this.menuContext().getItemState(optionItemProps),
      ...optionItemProps,
    }
  })

  ngOnInit() {
    this.menuOptionItemService.init(this.optionItemState)
    this.menuItemService.init(this.optionItemState)

    this.trackBindings()
  }
}
