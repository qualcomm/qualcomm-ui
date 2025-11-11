import type {Placement, PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {
  ActionSchema,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
} from "@qualcomm-ui/utils/machine"

export interface TooltipApiProps extends DirectionProperty {
  /**
   * Whether the tooltip should close when the trigger is clicked.
   */
  closeOnClick?: boolean

  /**
   * Whether the tooltip should close when the escape key is pressed.
   */
  closeOnEscape?: boolean

  /**
   * Controls the component's interactivity. If `true`, the component's trigger
   * element will not activate the tooltip.
   */
  disabled?: boolean

  /**
   * Function called when the tooltip is opened/closed.
   */
  onOpenChange?: ((open: boolean) => void) | undefined

  /**
   * The open state of the tooltip.
   */
  open?: boolean

  /**
   * The user provided options used to position the popover content
   *
   * @inheritDoc
   */
  positioning?: TooltipPositioningOptions | undefined
}

export interface TooltipPositioningOptions extends PositioningOptions {
  /**
   * The minimum padding between the arrow and the floating element's corner.
   * @default 10
   */
  arrowPadding?: number | undefined

  /**
   * The initial placement of the floating element
   *
   * @default 'top'
   */
  placement?: Placement | undefined
}

interface Events {
  type: "CLOSE" | "OPEN" | "POINTER.CLICK" | "POINTER.LEAVE" | "POINTER.ENTER"
}

interface Context {
  currentPlacement: Placement | undefined
}

type Actions = ActionSchema<
  | "closeIfDisabled"
  | "setGlobalId"
  | "clearGlobalId"
  | "invokeOnClose"
  | "invokeOnOpen"
>

type Effects = EffectSchema<"trackPositioning" | "trackEscapeKey">

type Guards = GuardSchema<"noVisibleTooltip">

interface Ids {
  arrow: string
  content: string
  positioner: string
  root: string
  trigger: string
}

export interface TooltipSchema {
  actions: Actions
  context: Context
  effects: Effects
  events: Events
  guards: Guards
  ids: Ids
  props: TooltipApiProps
}

interface CommonBindings extends DirectionProperty {
  "data-scope": "tooltip"
}

export interface TooltipArrowBindings extends CommonBindings {
  "data-part": "arrow"
  id: string
  style: JSX.CSSProperties
}

export interface TooltipArrowTipBindings extends CommonBindings {
  "data-part": "arrowTip"
  style: JSX.CSSProperties
}

export interface TooltipRootBindings {
  "data-part": "root"
}

export interface TooltipContentBindings extends CommonBindings {
  "data-part": "content"
  "data-placement": Placement | undefined
  "data-state": "open" | "closed"
  hidden: boolean
  id: string
  role: "tooltip"
}

export interface TooltipPositionerBindings extends CommonBindings {
  "data-part": "positioner"
  id: string
  style: JSX.CSSProperties
}

export interface TooltipTriggerBindings extends CommonBindings {
  "aria-describedby": string | undefined
  "data-expanded": BooleanDataAttr
  "data-part": "trigger"
  "data-state": "open" | "closed"
  id: string
  onBlur: JSX.FocusEventHandler
  onClick: JSX.MouseEventHandler
  onFocus: JSX.FocusEventHandler
  onPointerCancel: JSX.PointerEventHandler
  onPointerEnter: JSX.PointerEventHandler
  onPointerLeave: JSX.PointerEventHandler
}

export interface TooltipApi {
  getRootBindings(): TooltipRootBindings
  getTooltipArrowBindings(props: IdRegistrationProps): TooltipArrowBindings
  getTooltipArrowTipBindings(): TooltipArrowTipBindings
  getTooltipContentBindings(props: IdRegistrationProps): TooltipContentBindings
  getTooltipPositionerBindings(
    props: IdRegistrationProps,
  ): TooltipPositionerBindings
  getTooltipTriggerBindings(props: IdRegistrationProps): TooltipTriggerBindings
}
