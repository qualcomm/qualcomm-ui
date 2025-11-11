import {DOCUMENT} from "@angular/common"
import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
} from "@angular/core"
import {type ControlValueAccessor} from "@angular/forms"

import {AbstractCheckboxFormControlDirective} from "@qualcomm-ui/angular-core/checkbox"
import {useId} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {type CheckboxApiProps} from "@qualcomm-ui/core/checkbox"
import {
  createSwitchApi,
  type SwitchApiProps,
  switchMachine,
} from "@qualcomm-ui/core/switch"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {SwitchContextService} from "./switch-context.service"

@Directive()
export class CoreSwitchRootDirective
  extends AbstractCheckboxFormControlDirective
  implements
    SignalifyInput<Omit<CheckboxApiProps, "checked" | "form" | "ids">>,
    ControlValueAccessor,
    OnInit
{
  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * If true and the checkbox is not checked, the checkbox will be in the
   * `indeterminate` state.
   */
  readonly indeterminate = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string | undefined>(undefined)

  /**
   * The value of checkbox input. Useful for form submission.
   * @default "on"
   */
  readonly value = input<string | undefined>()

  protected readonly switchContextService = inject(SwitchContextService)
  protected document = inject(DOCUMENT)

  protected readonly hostId = computed(() => useId(this, this.id()))
  protected readonly trackBindings = useTrackBindings(() =>
    this.switchContextService.context().getRootBindings({id: this.hostId()}),
  )

  override ngOnInit() {
    super.ngOnInit()

    const machine = useMachine(
      switchMachine,
      computed<Explicit<SwitchApiProps>>(() => ({
        checked: this.checked(),
        defaultChecked: this.defaultChecked(),
        dir: this.dir(),
        disabled: this.isDisabled(),
        // angular handles this automatically with ngModel and Reactive Forms
        form: undefined,
        getRootNode: this.getRootNode() || (() => this.document),
        ids: undefined,
        invalid: this.invalid(),
        name: this.name(),
        onCheckedChange: (checked) => {
          this.onChange(checked)
          if (!this.control) {
            this.checkedChanged.emit(checked)
            this.checked.set(checked)
          }
          if (this.control && !this.control?.touched) {
            this.control?.markAsTouched?.()
          }
        },
        onFocusChange: (focused) => {
          if (!focused) {
            // only trigger on blur to prevent immediate validation, which would
            // occur as soon as the user interacts with the field.
            this.onTouched()
          }
        },
        readOnly: this.readOnly(),
        required: this.isRequired(),
        value: this.value(),
      })),
      this.injector,
    )

    this.switchContextService.init(
      computed(() => createSwitchApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
