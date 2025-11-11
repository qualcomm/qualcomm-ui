import type {BooleanAriaAttr, BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
} from "@qualcomm-ui/utils/machine"

export interface AccordionApiProps extends DirectionProperty {
  /**
   * Whether sections can be collapsed (in non-multiple mode).
   */
  collapsible?: boolean

  /**
   * Initial value of the accordion.
   */
  defaultValue?: string[] | undefined

  /**
   * The disabled state of the accordion.
   */
  disabled?: boolean

  /**
   * Whether multiple accordion items can be expanded at once.
   */
  multiple?: boolean

  /**
   * Focus change callback.
   */
  onFocusChange?: (value: string | null) => void

  /**
   * Value change callback.
   */
  onValueChange?: (value: string[]) => void

  /**
   * Value(s) of the accordion's open item(s).
   */
  value?: string[]
}

export interface AccordionItemApiProps {
  /**
   * The disabled state of the accordion item.
   */
  disabled?: boolean

  /**
   * The value of the accordion item.
   */
  value: string
}

type Actions = ActionSchema<
  | "expand"
  | "collapse"
  | "setValue"
  | "focusFirstTrigger"
  | "focusLastTrigger"
  | "focusNextTrigger"
  | "focusPrevTrigger"
  | "clearFocusedValue"
  | "setFocusedValue"
>

interface Context {
  focusedValue: string | null
  value: string[]
}

type Events =
  | {
      type: "VALUE.SET"
      values: string[] | null
    }
  | {
      type: "TRIGGER.CLICK"
      value: string | null
    }
  | {
      type: "TRIGGER.BLUR"
    }
  | {
      type: "TRIGGER.FOCUS"
      value: string | null
    }
  | {
      type: "GOTO.FIRST"
      value: string | null
    }
  | {
      type: "GOTO.LAST"
      value: string | null
    }
  | {
      type: "GOTO.NEXT"
      value: string | null
    }
  | {
      type: "GOTO.PREV"
      value: string | null
    }

type Guards = GuardSchema<"isExpanded" | "canToggle">

export interface AccordionElementIds {
  content: string[]
  item: string[]
  root: string
  trigger: string[]
}

export interface AccordionSchema extends MachineSchema {
  actions: Actions
  context: Context
  events: Events
  guards: Guards
  ids: AccordionElementIds
  props: RequiredBy<AccordionApiProps, "dir">
}

interface CommonBindings extends DirectionProperty {
  "data-scope": "accordion"
}

export interface AccordionRootBindings extends CommonBindings {
  "data-part": "root"
  id: string
}

export interface AccordionItemCommonBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-state": "open" | "closed"
}

export interface AccordionItemBindings extends AccordionItemCommonBindings {
  "data-part": "item"
  disabled?: boolean
  id: string
}

export interface AccordionItemTriggerBindings
  extends AccordionItemCommonBindings {
  "aria-controls": string
  "aria-disabled": BooleanAriaAttr
  "aria-expanded": BooleanAriaAttr
  "data-ownedby": string
  "data-part": "trigger"
  disabled?: boolean
  id: string
  onBlur: JSX.FocusEventHandler<HTMLButtonElement>
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  onFocus: JSX.FocusEventHandler<HTMLButtonElement>
  onKeyDown: JSX.KeyboardEventHandler<HTMLButtonElement>
  type: "button"
}

export interface AccordionItemTextBindings extends AccordionItemCommonBindings {
  "data-part": "item-text"
}

export interface AccordionItemSecondaryTextBindings
  extends AccordionItemCommonBindings {
  "data-part": "item-secondary-text"
}

export interface AccordionItemIndicatorBindings
  extends AccordionItemCommonBindings {
  "aria-hidden": true
  "data-part": "item-indicator"
}

export interface AccordionItemContentBindings
  extends AccordionItemCommonBindings {
  "aria-hidden": BooleanAriaAttr
  "aria-labelledby": string
  "data-expanded": BooleanDataAttr
  "data-part": "item-content"
  id: string
  role: "region"
}

export interface AccordionItemState extends AccordionItemApiProps {
  open: boolean
}

export interface AccordionApi {
  focusedValue: string | null
  setValue: (value: string[]) => void
  value: string[]

  // group: bindings
  getAccordionItemBindings(
    props: IdRegistrationProps & AccordionItemApiProps,
  ): AccordionItemBindings
  getAccordionItemContentBindings(
    props: IdRegistrationProps & AccordionItemApiProps,
  ): AccordionItemContentBindings
  getAccordionItemIndicatorBindings(
    props: AccordionItemApiProps,
  ): AccordionItemIndicatorBindings
  getAccordionItemSecondaryTextBindings(
    props: AccordionItemApiProps,
  ): AccordionItemSecondaryTextBindings
  getAccordionItemState(itemProps: AccordionItemApiProps): AccordionItemState
  getAccordionItemTextBindings(
    props: AccordionItemApiProps,
  ): AccordionItemTextBindings
  getAccordionItemTriggerBindings(
    props: IdRegistrationProps & AccordionItemApiProps,
  ): AccordionItemTriggerBindings
  getRootBindings(props: IdRegistrationProps): AccordionRootBindings
}
