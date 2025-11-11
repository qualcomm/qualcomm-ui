// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {IdParam} from "@qualcomm-ui/utils/attributes"

import type {JSX} from "./jsx"
import type {ElementCleanup} from "./prop-normalizer"

export type Dict = Record<string, any>

export type IdRegistrationProps = IdParam & ElementCleanup

export interface CommonProperties {
  /**
   * A root node to correctly resolve document in custom environments. i.e.,
   * Iframes, Electron.
   */
  getRootNode?: (() => ShadowRoot | Document | Node) | undefined
}

type AnyFunction = () => string | number | boolean | null | undefined
type TrackFn = (deps: AnyFunction[], fn: VoidFunction) => void

export interface Scope {
  getActiveElement: () => HTMLElement | null
  getById: <T extends Element = HTMLElement>(id: string) => T | null
  getDoc: () => Document
  getRootNode: () => ShadowRoot | Document | Node
  getWin: () => Window
  id?: string | undefined
  ids?: Record<string, any> | undefined
  isActiveElement: (elem: HTMLElement | null) => boolean
}

export type ScopeWithIds<T extends Dict> = Scope & {ids: BindableIds<T>}

export type ScopeDomIds<T, TScope extends ScopeWithIds<any>> = {
  [K in keyof T]: T[K] extends any[]
    ? (scope: TScope, itemKey: string) => string | undefined // collection
    : T[K] extends (id: string | number) => string
      ? (scope: TScope, id: string | number) => string
      : T[K] extends () => string
        ? (scope: TScope) => string
        : (scope: TScope) => string // single
}

export type ScopeDomElements<
  T,
  TScope extends ScopeWithIds<any>,
  TElementTypes extends Partial<Record<keyof T, HTMLElement | null>> = {},
> = {
  [K in keyof T]: T[K] extends any[]
    ? (scope: TScope, itemKey: string) => HTMLElement | null // collection
    : T[K] extends (id: string | number) => string
      ? (
          scope: TScope,
          id: string | number,
        ) => K extends keyof TElementTypes
          ? TElementTypes[K]
          : HTMLElement | null
      : T[K] extends () => string
        ? (
            scope: TScope,
          ) => K extends keyof TElementTypes
            ? TElementTypes[K]
            : HTMLElement | null
        : (
            scope: TScope,
          ) => K extends keyof TElementTypes
            ? TElementTypes[K]
            : HTMLElement | null
}

export interface ComputedParams<T extends Dict> {
  computed: ComputedFn<T>
  context: BindableContext<T>
  prop: PropFn<T>
  refs: BindableRefs<T>
  scope: ScopeWithIds<T>
}

export interface PropFn<T extends Dict> {
  <K extends keyof T["props"]>(key: K): T["props"][K]
}

export type ValueOrFn<T> = T | ((prev: T) => T)

export interface EventDetails<E = JSX.SyntheticEvent> {
  /**
   * The DOM event associated with the change.
   */
  event?: E | undefined
}

export interface BindableParams<T, ChangeEvent> {
  defaultValue?: T | undefined
  hash?: (a: T) => string
  isEqual?: (a: T, b: T | undefined) => boolean
  onChange?: (value: T, details: ChangeEvent, prevValue: T | undefined) => void
  sync?: boolean
  value?: T | undefined
}

/**
 * A `bindable` is a special type of object that serves as a bridge between
 * the machine's internal state and the UI framework you're using. Bindables enable
 * this solution to be framework-agnostic while providing a consistent API for wiring
 * up framework reactivity.
 */
export interface Bindable<T, ChangeEvent> {
  get: () => T
  hash(value: T | undefined): string
  initial: T | undefined
  invoke(nextValue: T, prevValue: T): void
  ref: any
  set(value: ValueOrFn<T>, args?: ChangeEvent): void
}

interface BindableFn {
  <K, ChangeEvent = void>(
    params: () => BindableParams<K, ChangeEvent>,
  ): Bindable<K, ChangeEvent>
}

/**
 * bindable IDs function similarly to `bindable`, but differ in that they're
 * reserved exclusively for element IDs. We need reactivity here because accessible
 * elements, like labels, can be conditionally rendered and dependent elements need
 * to account for this.
 */
export interface BindableId<T> {
  get: () => T | undefined
  set(value: T): void
}

export interface BindableIdFn {
  <K>(initialValue?: string): BindableId<K>
}

export interface BindableIdCollectionFn {
  <T>(): {
    get(itemKey: string): T | undefined
    getAll(): Record<string, T>
    keys(): string[]
    register(
      itemKey: string,
      value: T,
      onDestroy?: (callback: () => void) => void,
    ): void
    remove(itemKey: string): void
    set(itemKey: string, value: T): void
  }
}

export interface IdParams<T extends Dict> {
  bindableId: BindableIdFn
  bindableIdCollection: BindableIdCollectionFn
  ids: PropsParams<T>["props"]["ids"]
}

export interface BindableRefs<T extends Dict> {
  get<K extends keyof T["refs"]>(key: K): T["refs"][K]
  set<K extends keyof T["refs"]>(key: K, value: T["refs"][K]): void
}

export type CtxValue<T> = T extends readonly [infer V, ...any[]] ? V : T
export type CtxDetails<T> = T extends readonly [any, infer D, ...any[]]
  ? D
  : void
export type DetailTuple<D> = D extends void ? [] : [details: D]

export interface BindableContext<T extends Dict> {
  get<K extends keyof T["context"]>(key: K): CtxValue<T["context"][K]>
  hash<K extends keyof T["context"]>(key: K): string | undefined
  initial<K extends keyof T["context"]>(
    key: K,
  ): CtxValue<T["context"][K]> | undefined
  set<K extends keyof T["context"]>(
    key: K,
    value: ValueOrFn<CtxValue<T["context"][K]>>,
    /**
     * Details is a single argument from the caller's pov. The rest-parameter syntax
     * `(...details)` is only used to express a type-level trick that TypeScript
     * hasn’t put in the normal parameter syntax yet: "sometimes this parameter is
     * present, sometimes it is completely missing."
     */
    ...details: DetailTuple<CtxDetails<T["context"][K]>>
  ): void
}

// Helper types to distinguish single vs collection ID keys
type SingleIdKeys<T extends Dict> = {
  [K in keyof T["ids"]]: T["ids"][K] extends any[] ? never : K
}[keyof T["ids"]]

type CollectionIdKeys<T extends Dict> = {
  [K in keyof T["ids"]]: T["ids"][K] extends any[] ? K : never
}[keyof T["ids"]]

type CollectionIdType<
  T extends Dict,
  K extends CollectionIdKeys<T>,
> = T["ids"][K] extends (infer U)[] ? U : never

export interface BindableIdCollection<
  T extends Dict,
  K extends CollectionIdKeys<T>,
> {
  get(itemKey: string): CollectionIdType<T, K> | undefined
  getAll(): Record<string, CollectionIdType<T, K>>
  keys(): string[]
  register(
    itemKey: string,
    value: CollectionIdType<T, K>,
    onDestroy?: (callback: () => void) => void,
  ): void
  remove(itemKey: string): void
  set(itemKey: string, value: CollectionIdType<T, K>): void
}

export interface BindableIds<T extends Dict> {
  collection<K extends CollectionIdKeys<T>>(key: K): BindableIdCollection<T, K>
  get<K extends SingleIdKeys<T>>(key: K): T["ids"][K]
  register<K extends SingleIdKeys<T>>(
    key: K,
    value: T["ids"][K],
    onDestroy?: (callback: () => void) => void,
  ): void
  register<K extends SingleIdKeys<T>>(key: K, params: IdRegistrationProps): void
  set<K extends SingleIdKeys<T>>(key: K, value: T["ids"][K]): void
}

export interface ComputedFn<T extends Dict> {
  <K extends keyof T["computed"]>(key: K): T["computed"][K]
}

export type Actions<T extends Dict> = {
  [K in keyof T["actions"]]: (params: Params<T>) => void
}

export type EventType<T extends Dict> = {
  type: T["events"]["type"]
} & T["events"]

export interface ContextParams<T extends Dict> {
  bindable: BindableFn
  flush: (fn: VoidFunction) => void
  getComputed: () => ComputedFn<T>
  getContext: () => BindableContext<T>
  getEvent: () => EventType<T>
  getRefs: () => BindableRefs<T>
  prop: PropFn<T>
  scope: ScopeWithIds<T>
}

type MaybeArray<T> = T | T[]

export type ChooseFn<T extends Dict> = (
  transitions: MaybeArray<Omit<Transition<T>, "target">> | undefined,
) => Transition<T> | undefined

/**
 * Represents the function signature for sending events to the machine.
 * It uses an intersection of function signatures derived from the `events`
 * definition in the machine schema `T` to enforce correct payload types.
 * @template T The machine schema (`Dict` conforming to `MachineSchema`).
 */
export type SendFn<T extends Dict> = (event: EventType<T>) => void

/**
 * Represents an ASYNCHRONOUS function signature for sending events,
 * mirroring SendFn<T> but returning Promise<void>.
 * Used for test wrappers involving async operations like `act`.
 * @template T The machine schema (`Dict` conforming to `MachineSchema`).
 */
export type AsyncSendFn<T extends Dict> = (event: EventType<T>) => Promise<void>

export interface Params<T extends Dict> {
  action: (action: ActionsOrFn<T>) => void
  actions: Actions<T>
  choose: ChooseFn<T>
  computed: ComputedFn<T>
  context: BindableContext<T>
  event: EventType<T> & {
    current(): EventType<T>
    previous(): EventType<T>
  }
  flush: (fn: VoidFunction) => void
  guard: <K extends keyof T["guards"]>(
    fn: GuardFn<T> | K,
  ) => boolean | undefined
  prop: PropFn<T>
  refs: BindableRefs<T>
  scope: ScopeWithIds<T>
  send: SendFn<T>
  state: Bindable<T["state"], void> & {
    hasTag: (tag: T["tag"]) => boolean
    matches: (...values: T["state"][]) => boolean
  }
  track: TrackFn
}

export interface WatchParams<T extends Dict> extends Params<T> {
  actions: {
    [K in keyof T["actions"]]: () => void
  }
}

export interface PropsParams<T extends Dict> {
  props: Partial<T["props"]>
  scope: ScopeWithIds<T>
}

interface RefsParams<T extends Dict> {
  context: BindableContext<T>
  prop: PropFn<T>
}

export type GuardFn<T extends Dict> = (params: Params<T>) => boolean | undefined

export interface Transition<T extends Dict> {
  actions?: (keyof T["actions"])[]
  guard?: keyof T["guards"] | GuardFn<T>
  reenter?: boolean
  target?: T["state"]
}

export type TransitionForEvent<T extends Dict> = Omit<
  Transition<T>,
  "guard"
> & {
  guard?: keyof T["guards"] | GuardFn<T>
}

export type ActionSchema<T extends string> = Record<T, () => void>
export type GuardSchema<T extends string> = Record<T, () => boolean | undefined>
export type EffectSchema<T extends string> = Record<T, () => void>

export interface MachineSchema {
  actions?: ActionSchema<string>
  computed?: Record<string, any>
  context?: Record<string, any>
  effects?: EffectSchema<string>
  event?: {type: string} & Dict
  events?: Record<string, NonNullable<EventType<any>>>
  guards?: GuardSchema<string>
  ids?: Record<string, any>
  props?: Record<string, any>
  refs?: Record<string, any>
  state?: string
  tag?: string
}

type ConfigCtxDetails<T> = T extends void | undefined | null | never ? void : T

type IdsProperty<T> = T extends {ids: any}
  ? {
      /**
       * A collection of reactive ids that are associated with specific elements for
       * accessibility.
       */
      ids: (params: IdParams<T>) => {
        [K in keyof T["ids"]]: T["ids"][K] extends any[]
          ? BindableIdCollection<T, K>
          : BindableId<T["ids"][K]>
      }
    }
  : {
      ids?: any
    }

type ActionsProperty<T> = T extends {actions: any}
  ? {
      actions: {
        [K in keyof T["actions"]]: (params: Params<T>) => void
      }
    }
  : {
      actions?: any
    }

/**
 * Pure functions (without side effects). Used to return derived state.
 */
type ComputedProperty<T> = T extends {computed: any}
  ? {
      computed: {
        [K in keyof T["computed"]]: (
          params: ComputedParams<T>,
        ) => T["computed"][K]
      }
    }
  : {
      computed?: any
    }

/**
 * A collection of reactive values that can change over time and influence the
 * behavior of the machine.
 */
type ContextProperty<T> = T extends {context: any}
  ? {
      context: (params: ContextParams<T>) => {
        [K in keyof T["context"]]: Bindable<
          CtxValue<T["context"][K]>,
          ConfigCtxDetails<
            // pick the second tuple slot *if* we are in a tuple,
            // otherwise the whole entry is passed through
            T["context"][K] extends readonly [K, infer D, ...any[]] ? D : never
          >
        >
      }
    }
  : {
      context?: any
    }

type EffectsProperty<T> = T extends {effects: any}
  ? {
      effects: {
        [K in keyof T["effects"]]: (params: Params<T>) => void
      }
    }
  : {
      effects?: any
    }

type GuardsProperty<T> = T extends {guards: any}
  ? {
      guards: {
        [K in keyof T["guards"]]: GuardFn<T>
      }
    }
  : {
      guards?: any
    }

type PropsProperty<T> = T extends {props: any}
  ? {
      props: (params: PropsParams<T>) => T["props"]
    }
  : {
      props?: any
    }

type RefsProperty<T> = T extends {refs: any}
  ? {
      refs: (params: RefsParams<T>) => T["refs"]
    }
  : {
      refs?: any
    }

export type ActionsOrFn<T extends Dict> =
  | (keyof T["actions"])[]
  | ((params: Params<T>) => (keyof T["actions"])[] | undefined)

/**
 * aka `Machine` in Zag
 */
export type MachineConfig<T extends Dict> = ActionsProperty<T> &
  ContextProperty<T> &
  ComputedProperty<T> &
  EffectsProperty<T> &
  GuardsProperty<T> &
  IdsProperty<T> &
  PropsProperty<T> &
  RefsProperty<T> & {
    /**
     * Actions to fire when the machine is exiting.
     * This maps to Zag's `exit` field in their config.
     */
    exitActions?: ActionsOrFn<T>

    /**
     * actions to fire when the machine is first initialized.
     * this maps to Zag's `entry` field in their config.
     */
    initialActions?: ActionsOrFn<T>

    /**
     * effects to fire when the machine is first initialized.
     * Our `effects` field lives at the root of each config, whereas Zag's lives in
     * `implementations`. Zag has a root `effects` field which fires effects when
     * the machine is first initialized. This is the equivalent for that field.
     */
    initialEffects?: (keyof T["effects"])[]

    initialState: (params: {prop: PropFn<T>}) => T["state"]

    on?: {
      [E in T["events"]["type"]]?:
        | TransitionForEvent<T>
        | Array<TransitionForEvent<T>>
    }

    states: {
      [K in T["state"]]: {
        effects?: (keyof T["effects"])[]
        entry?: ActionsOrFn<T>
        exit?: ActionsOrFn<T>
        on?: {
          [E in T["events"]["type"]]?:
            | TransitionForEvent<T>
            | Array<TransitionForEvent<T>>
        }
        tags?: T["tag"][]
      }
    }

    /**
     * For reacting to state changes with side effects.
     */
    watch?: (params: WatchParams<T>) => void
  }

type State<T extends MachineSchema> = Bindable<T["state"], void> & {
  hasTag: (tag: T["tag"]) => boolean
  matches: (...values: T["state"][]) => boolean
}

/**
 * aka `Service` in Zag
 */
export interface Machine<T extends MachineSchema> {
  computed: ComputedFn<T>
  context: BindableContext<T>
  event: EventType<T> & {
    current(): EventType<T>
    previous(): EventType<T>
  }
  prop: PropFn<T>
  refs: BindableRefs<T>
  scope: ScopeWithIds<T>
  send: SendFn<T>
  state: State<T> & {
    hasTag: (tag: T["tag"]) => boolean
    matches: (...values: T["state"][]) => boolean
  }
}
