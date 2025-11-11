import type {FieldApiProps} from "@qualcomm-ui/core/field"
import type {
  InputClearTriggerBindings,
  InputErrorIndicatorBindings,
  InputErrorTextBindings,
  InputHintBindings,
  InputInputBindings,
  InputInputGroupBindings,
  InputLabelBindings,
  InputRootBindings,
} from "@qualcomm-ui/core/input"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  IdRegistrationProps,
  MachineSchema,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

export interface TextInputElementIds {
  errorText: string
  hint: string
  input: string
  label: string
}

export interface TextInputApiProps
  extends FieldApiProps,
    CommonProperties,
    DirectionProperty {
  /**
   * The initial value of the input when rendered.
   * Use when you don't need to control the value of the input.
   */
  defaultValue?: string | undefined

  /**
   * The id of the form that the input belongs to.
   */
  form?: string | undefined

  /**
   * The ids of the elements that are associated with the input. These will be
   * automatically generated if omitted.
   */
  ids?: TextInputElementIds | undefined

  /**
   * The name of the input field. Useful for form submission.
   */
  name?: string | undefined

  /**
   * The callback invoked when the field is focused or blurred.
   */
  onFocusChange?: ((focused: boolean) => void) | undefined

  /**
   * The callback invoked when the value changes.
   */
  onValueChange?: ((value: string) => void) | undefined

  /**
   * The controlled value of the input
   */
  value?: string | undefined
}

export interface TextInputScope extends ScopeWithIds<TextInputSchema> {}

interface TextInputContext {
  fieldsetDisabled: boolean
  focused: boolean
  focusVisible: boolean
  value: string
}

export interface TextInputSchema extends MachineSchema {
  actions: ActionSchema<"setValue" | "setFocused" | "focusInputEl">
  computed: {
    disabled: boolean
  }
  context: TextInputContext
  effects: EffectSchema<"trackFormControlState">
  events:
    | {
        focused: boolean
        focusVisible: boolean
        type: "FOCUSED.SET"
      }
    | {
        type: "VALUE.SET"
        value: string
      }
    | {type: "INPUT.FOCUS"}
  ids: TextInputElementIds
  props: RequiredBy<TextInputApiProps, "defaultValue" | "dir">
  state: "idle"
}

export interface TextInputScopeAttribute {
  "data-scope": "text-input"
}

interface CommonBindings
  extends Required<DirectionProperty>,
    TextInputScopeAttribute {}

export interface TextInputRootBindings
  extends CommonBindings,
    InputRootBindings {}

export interface TextInputLabelBindings
  extends CommonBindings,
    InputLabelBindings {}

export interface TextInputErrorTextBindings
  extends CommonBindings,
    InputErrorTextBindings {}

export interface TextInputHintBindings
  extends CommonBindings,
    InputHintBindings {}

export interface TextInputClearTriggerBindings
  extends CommonBindings,
    InputClearTriggerBindings {}

export interface TextInputInputGroupBindings
  extends CommonBindings,
    InputInputGroupBindings {}

export interface TextInputErrorIndicatorBindings
  extends CommonBindings,
    InputErrorIndicatorBindings {}

export interface TextInputInputBindings
  extends CommonBindings,
    InputInputBindings {
  autoComplete: "off"
  autoCorrect: "off"
  "data-readonly": BooleanDataAttr
  readOnly: boolean | undefined
  spellCheck: "false"
  type: "text"
}

export interface TextInputApi {
  disabled: boolean | undefined
  focusInput(): void
  invalid: boolean | undefined
  required: boolean | undefined
  setValue(value: string): void
  value: string

  // group: element prop getters
  getClearTriggerBindings(): TextInputClearTriggerBindings
  getErrorIndicatorBindings(): TextInputErrorIndicatorBindings
  getErrorTextBindings(props: IdRegistrationProps): TextInputErrorTextBindings
  getHintBindings(props: IdRegistrationProps): TextInputHintBindings
  getInputBindings(props: IdRegistrationProps): TextInputInputBindings
  getInputGroupBindings(): TextInputInputGroupBindings
  getLabelBindings(props: IdRegistrationProps): TextInputLabelBindings
  getRootBindings(): TextInputRootBindings
}
