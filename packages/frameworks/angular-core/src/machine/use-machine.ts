// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  afterRenderEffect,
  computed as computedSignal,
  type Injector,
  isSignal,
  runInInjectionContext,
  type Signal,
  untracked,
} from "@angular/core"

import {createScope} from "@qualcomm-ui/dom/query"
import {toArray} from "@qualcomm-ui/utils/array"
import {ensure, isFunction, isString} from "@qualcomm-ui/utils/guard"
import {
  type ActionsOrFn,
  type BindableContext,
  type BindableIds,
  type ChooseFn,
  type ComputedFn,
  type CtxDetails,
  type CtxValue,
  type DetailTuple,
  type EventType,
  type GuardFn,
  INIT_STATE,
  type Machine,
  type MachineConfig,
  type MachineSchema,
  MachineStatus,
  type Params,
  type SendFn,
  type Transition,
  type ValueOrFn,
  type WatchParams,
} from "@qualcomm-ui/utils/machine"
import {compact} from "@qualcomm-ui/utils/object"

import {bindable} from "./bindable"
import {bindableId} from "./bindable-id"
import {bindableIdCollection} from "./bindable-id-collection"
import {createRefs} from "./refs"
import {useTrack} from "./track"

export interface MachineOpts {
  /**
   * If true, enable debug logging.
   *
   * @default false
   */
  debug?: boolean | undefined
}

export function useMachine<T extends MachineSchema>(
  config: MachineConfig<T>,
  userProps: Partial<T["props"]> | Signal<Partial<T["props"]>> = {},
  injector: Injector,
  opts: MachineOpts = {},
): Machine<T> {
  const debug = (...args: any[]) => {
    if (opts.debug) {
      console.debug(...args)
    }
  }

  const scope = computedSignal(() => {
    const {getRootNode, id} = access<any>(userProps)
    return createScope({getRootNode, id})
  })

  const configIds = config.ids?.({
    bindableId,
    bindableIdCollection: () => bindableIdCollection(),
  })

  const ids: BindableIds<T> = {
    collection(key) {
      return configIds?.[key]
    },
    get(key) {
      return configIds?.[key]?.get?.()
    },
    register(key, valueOrParams, onDestroy?: any) {
      if (
        typeof valueOrParams === "object" &&
        valueOrParams !== null &&
        "id" in valueOrParams
      ) {
        const params = valueOrParams
        configIds?.[key].set?.(params.id)
        params.onDestroy?.(() => configIds?.[key].set?.(undefined))
      } else {
        configIds?.[key].set?.(valueOrParams)
        onDestroy?.(() => configIds?.[key].set?.(undefined))
      }
    },
    set(key, value) {
      configIds?.[key].set?.(value)
    },
  }

  const props = computedSignal(
    () =>
      config.props?.({
        props: compact(access(userProps)),
        scope: {...scope(), ids},
      }) ?? access(userProps),
  )

  const prop = useProp<T["props"]>(props)

  let previousEventRef: any = null
  let eventRef: any = {type: ""}

  const getEvent = () => ({
    ...eventRef,
    current() {
      return eventRef
    },
    previous() {
      return previousEventRef
    },
  })

  const context: BindableContext<T> = {
    get<K extends keyof T["context"]>(key: K) {
      return configContext![key]?.get()
    },
    hash(key): string | undefined {
      const current = configContext?.[key].get()
      return configContext?.[key].hash(current)
    },
    initial<K extends keyof T["context"]>(key: K) {
      return configContext?.[key].initial
    },
    set<K extends keyof T["context"]>(
      key: K,
      value: ValueOrFn<CtxValue<T["context"][K]>>,
      ...details: DetailTuple<CtxDetails<T["context"][K]>>
    ): void {
      configContext?.[key].set(value, ...(details as any))
    },
  }

  const refs = createRefs(config.refs?.({context, prop}) ?? {})

  const configContext = config.context?.({
    bindable,
    flush,
    getComputed() {
      return computed
    },
    getContext() {
      return context
    },
    getEvent() {
      return getEvent()
    },
    getRefs() {
      return refs
    },
    prop,
    get scope() {
      return {...scope(), ids}
    },
  })

  const computed: ComputedFn<T> = (key) => {
    ensure(config.computed, () => `No computed object found on machine`)
    const fn = config.computed[key]
    return fn({
      computed,
      context,
      prop,
      refs,
      get scope() {
        return {...scope(), ids}
      },
    })
  }

  // Create the actions object with direct property access
  const actions = {} as {
    [K in keyof T["actions"]]: () => void
  }

  if (config.actions) {
    for (const key of Object.keys(config.actions) as Array<
      keyof T["actions"]
    >) {
      const actionFn = config.actions[key]

      actions[key] = () => {
        return actionFn(getParams())
      }
    }
  }

  let effectsRef = new Map<string, VoidFunction>()
  let transitionRef: Transition<T> | null = null

  const action = (keys: ActionsOrFn<T> | undefined) => {
    if (!keys) {
      return
    }
    const strs = isFunction(keys) ? keys(getParams()) : keys
    if (!strs) {
      return
    }
    for (const key of strs) {
      const fn = config.actions?.[key]
      if (fn) {
        fn(getParams())
      }
    }
  }

  const guard = <K extends keyof T["guards"]>(guard: K | GuardFn<T>) => {
    if (isFunction(guard)) {
      return guard(getParams())
    }
    return config.guards?.[guard](getParams())
  }

  const choose: ChooseFn<T> = (transitions) => {
    return toArray(transitions).find((t) => {
      let result: boolean | undefined = !t.guard
      if (isString(t.guard)) {
        result = !!guard(t.guard)
      } else if (isFunction(t.guard)) {
        result = t.guard(getParams())
      }
      return result
    })
  }

  const effect = (keys: (keyof T["effects"])[] | undefined) => {
    if (!keys) {
      return undefined
    }
    const fns = keys.map((s) => {
      return config.effects?.[s]
    })
    const cleanups: VoidFunction[] = []
    for (const fn of fns) {
      const cleanup = fn?.(getParams())
      if (cleanup) {
        cleanups.push(cleanup)
      }
    }
    return () => cleanups.forEach((fn) => fn?.())
  }

  const state = bindable(() => ({
    defaultValue: config.initialState({prop}),
    name: "state",
    onChange: (nextState, details: unknown, prevState) => {
      // compute effects: exit -> transition -> enter

      // exit effects
      if (prevState) {
        const exitEffects = effectsRef.get(prevState)
        exitEffects?.()
        effectsRef.delete(prevState)
      }

      // exit actions
      if (prevState) {
        action(config.states[prevState]?.exit)
      }

      // transition actions
      action(transitionRef?.actions)

      // enter effect
      const cleanup = effect(config.states[nextState]?.effects)
      if (cleanup) {
        effectsRef.set(nextState as string, cleanup)
      }

      // root entry actions
      if (prevState === "__init__") {
        action(config.onInit?.actions)
        const cleanup = effect(config.onInit?.effects ?? [])
        if (cleanup) {
          effectsRef.set("__init__", cleanup)
        }
      }

      // enter actions
      action(config.states[nextState]?.entry)
    },
  }))

  const getState = () => ({
    ...state,
    hasTag(tag: T["tag"]) {
      return !!config.states[state.get()]?.tags?.includes(tag)
    },
    matches(...values: T["state"][]) {
      return values.includes(state.get())
    },
  })

  const send = (event: EventType<T>) => {
    queueMicrotask(() => {
      previousEventRef = {...eventRef}
      eventRef = {...event}
      const currentState = state.get()

      debug("send", {currentState, event})

      const transitions =
        config.states[currentState]?.on?.[event.type] ?? config.on?.[event.type]

      const transition = choose(transitions)
      if (!transition) {
        return
      }

      // save current transition
      transitionRef = transition

      const target = transition.target ?? currentState
      const changed = target !== currentState

      debug("transition", transition)

      if (changed) {
        state.set(target)
      } else if (transition.reenter && !changed) {
        // reenter will re-invoke the current state
        state.invoke(currentState, currentState)
      } else {
        // call transition actions
        action(transition.actions ?? [])
      }
    })
  }

  const getParams = (): Params<T> => ({
    action,
    actions,
    choose,
    computed,
    context,
    event: getEvent(),
    flush,
    guard,
    prop,
    refs,
    get scope() {
      return {...scope(), ids}
    },
    send: send as SendFn<T>,
    state: getState(),
    track: useTrack(injector),
  })

  config.watch?.(getParams() as WatchParams<T>)

  let status: MachineStatus = MachineStatus.NOT_STARTED

  runInInjectionContext(injector, () => {
    afterRenderEffect((onCleanup) => {
      const started = status === MachineStatus.STARTED

      status = MachineStatus.STARTED

      debug(started ? "rehydrating..." : "initializing...")

      untracked(() => state.invoke(state.initial, INIT_STATE))

      onCleanup(() => {
        debug("unmounting...")

        status = MachineStatus.STOPPED

        effectsRef.forEach((fn) => fn())

        effectsRef = new Map()
        transitionRef = null

        action(config.onDestroy?.actions)
      })
    })
  })

  return {
    computed,
    context,
    event: getEvent(),
    prop,
    refs,
    get scope() {
      return {...scope(), ids}
    },
    send: send as SendFn<T>,
    state: getState(),
  }
}

function flush(fn: VoidFunction) {
  queueMicrotask(() => {
    fn()
  })
}

function access<T>(value: T | Signal<T>) {
  return isSignal(value) ? value() : value
}

function useProp<T>(value: Signal<T>) {
  return function get<K extends keyof T>(key: K): T[K] {
    return value()[key]
  }
}
