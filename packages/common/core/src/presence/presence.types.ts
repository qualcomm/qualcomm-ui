import type {
  ActionSchema,
  EffectSchema,
  MachineSchema,
} from "@qualcomm-ui/utils/machine"

export interface RenderStrategyApiProps {
  /**
   * When true, the component will not be rendered in the DOM until it becomes
   * visible or active.
   *
   * @default false
   */
  lazyMount?: boolean

  /**
   * When true, the component will be completely removed from the DOM when it
   * becomes inactive or hidden, rather than just being hidden with CSS.
   *
   * @default false
   */
  unmountOnExit?: boolean
}

export interface PresenceApiProps extends RenderStrategyApiProps {
  /**
   * Whether to synchronize the present change immediately or defer it to the next
   * frame
   */
  immediate?: boolean | undefined

  /**
   * Function called when the animation ends in the closed state
   */
  onExitComplete?: VoidFunction | undefined

  /**
   * Whether the node is present (controlled by the user)
   */
  present?: boolean | undefined

  /**
   * Whether to allow the initial presence animation.
   * @default false
   */
  skipAnimationOnMount?: boolean
}

export interface PresenceSchema extends MachineSchema {
  actions: ActionSchema<
    | "cleanupNode"
    | "clearInitial"
    | "clearPrevAnimationName"
    | "invokeOnExitComplete"
    | "setInitial"
    | "setNode"
    | "setPrevAnimationName"
    | "setStyles"
    | "syncPresence"
  >
  context: {
    initial: boolean
    present: boolean
    prevAnimationName: string | null
    unmountAnimationName: string | null
  }
  effects: EffectSchema<"trackAnimationEvents">
  events:
    | {
        node: HTMLElement | null
        type: "NODE.SET"
      }
    | {
        src?: string
        type: "UNMOUNT" | "MOUNT"
      }
    | {
        type: "UNMOUNT.SUSPEND"
      }
  id: "presence"
  props: PresenceApiProps
  refs: {
    node: HTMLElement | null
    styles: CSSStyleDeclaration | null
  }
  state: "unmounted" | "unmountSuspended" | "mounted"
}

export interface PresenceBindings {
  "data-state": "open" | "closed" | undefined
  hidden: boolean
}

export interface RenderStrategyApi {
  lazyMount: boolean | undefined
  unmountOnExit: boolean | undefined
}

export interface PresenceApi
  extends Pick<
    PresenceApiProps,
    "lazyMount" | "skipAnimationOnMount" | "unmountOnExit"
  > {
  /**
   * Whether the node is present in the DOM.
   */
  present: boolean

  /**
   * Function to set the node (as early as possible)
   */
  setNode(node: HTMLElement | null): void

  /**
   * Whether the animation should be skipped.
   */
  skip: boolean

  /**
   * Function to programmatically unmount the node
   */
  unmount(): void

  /**
   * Whether the node is unmounted.
   */
  unmounted?: boolean
}
