// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type RefObject, useMemo, useRef, useState} from "react"

import {flushSync} from "react-dom"

import {createScope} from "@qualcomm-ui/dom/query"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {toArray} from "@qualcomm-ui/utils/array"
import {isFunction, isString} from "@qualcomm-ui/utils/guard"
import {
  type ActionsOrFn,
  type Bindable,
  type BindableContext,
  type BindableIds,
  type BindableRefs,
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
  type PropsParams,
  type SendFn,
  type ValueOrFn,
  type WatchParams,
} from "@qualcomm-ui/utils/machine"
import {compact} from "@qualcomm-ui/utils/object"

import {useBindable} from "./use-bindable"
import {useBindableId} from "./use-bindable-id"
import {useBindableIdCollection} from "./use-bindable-id-collection"
import {useLiveRef, useProp} from "./use-prop"
import {useTrack} from "./use-track"

export interface UseMachineOpts {
  /**
   * If true, enable debug logging.
   *
   * @default false
   */
  debug?: boolean | undefined
}

export function useMachine<T extends MachineSchema>(
  config: MachineConfig<T>,
  userProps: Partial<T["props"]> = {},
  opts: UseMachineOpts = {},
): Machine<T> {
  const debug = (...args: any[]) => {
    if (opts.debug) {
      console.debug(...args)
    }
  }

  const [, setSsr] = useState<boolean>(true)

  // required for composite id synchronization
  useSafeLayoutEffect(() => {
    setSsr(false)
  }, [])

  const scope = useMemo(() => {
    const {getRootNode, id, ids} = userProps as any
    return createScope({getRootNode, id, ids})
  }, [userProps])

  const configIds = config.ids?.({
    bindableId: useBindableId,
    bindableIdCollection: useBindableIdCollection,
    ids: (userProps as any).ids,
  })
  const idsRef = useLiveRef(configIds)

  const ids: RefObject<BindableIds<T>> = useRef({
    collection(key) {
      return idsRef.current?.[key]
    },
    get(key) {
      return idsRef.current?.[key].get()
    },
    register(key, valueOrParams, onDestroy?: any) {
      if (
        typeof valueOrParams === "object" &&
        valueOrParams !== null &&
        "id" in valueOrParams
      ) {
        const params = valueOrParams
        idsRef.current?.[key].set(params.id)
        params.onDestroy?.(() =>
          idsRef.current?.[key].set(undefined, {
            cleanup: true,
            immediate: true,
          }),
        )
      } else {
        idsRef.current?.[key].set(valueOrParams)
        onDestroy?.(() =>
          idsRef.current?.[key].set(undefined, {
            cleanup: true,
            immediate: true,
          }),
        )
      }
    },
    set(key, value) {
      idsRef.current?.[key].set(value)
    },
  })

  const props: NonNullable<T["props"]> =
    config.props?.({
      props: compact(userProps),
      scope: {...scope, ids: ids.current},
    } satisfies PropsParams<T>) ?? userProps

  const prop = useProp(props)

  const configContext = config.context?.({
    bindable: useBindable,
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
    scope: {...scope, ids},
  })

  const contextRef = useLiveRef(configContext)

  const context: BindableContext<T> = {
    get<K extends keyof T["context"]>(key: K) {
      return contextRef.current?.[key].ref.current as never
    },
    hash(key): string | undefined {
      const current = contextRef.current?.[key].get()
      return contextRef.current?.[key].hash(current)
    },
    initial<K extends keyof T["context"]>(key: K) {
      return contextRef.current?.[key].initial as never
    },
    set<K extends keyof T["context"]>(
      key: K,
      value: ValueOrFn<CtxValue<T["context"][K]>>,
      ...details: DetailTuple<CtxDetails<T["context"][K]>>
    ): void {
      contextRef.current?.[key].set(value, ...(details as any))
    },
  }

  const refs: BindableRefs<T> = useRefs(config.refs?.({context, prop}) ?? {})

  const computed: ComputedFn<T> = (key) => {
    if (!config.computed) {
      throw new Error(`No computed object found on store`)
    }
    const fn = config.computed[key]
    return fn({
      computed,
      context,
      event: getEvent(),
      prop,
      refs,
      scope: {...scope, ids: ids.current},
    })
  }

  const effects = useRef(new Map<string, VoidFunction>())
  const transitionRef = useRef<any>(null)

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
        return actionFn(getParams.current())
      }
    }
  }

  // state changes
  const getState = () => ({
    ...state,
    hasTag(tag: T["tag"]) {
      return !!config.states[state.ref.current as T["state"]]?.tags?.includes(
        tag,
      )
    },
    matches(...values: T["state"][]) {
      return values.includes(state.ref.current)
    },
  })

  const guard = <K extends keyof T["guards"]>(guard: K | GuardFn<T>) => {
    if (isFunction(guard)) {
      return guard(getParams.current())
    }
    return config.guards?.[guard](getParams.current())
  }

  const choose: ChooseFn<T> = (transitions = []) => {
    return toArray(transitions).find((t) => {
      if (isString(t.guard)) {
        return !!guard(t.guard)
      } else if (isFunction(t.guard)) {
        return t.guard(getParams.current())
      }
      return !t.guard
    })
  }

  const effect = (keys: (keyof T["effects"])[] | undefined) => {
    if (!keys) {
      return
    }
    const fns = keys.map((s) => {
      return config.effects?.[s]
    })
    const cleanups: VoidFunction[] = []
    for (const fn of fns) {
      const cleanup = fn?.(getParams.current())
      if (cleanup) {
        cleanups.push(cleanup)
      }
    }
    return () => cleanups.forEach((fn) => fn?.())
  }

  const action = (keys: ActionsOrFn<T> | undefined) => {
    if (!keys) {
      return
    }
    const strs = isFunction(keys) ? keys(getParams.current()) : keys
    if (!strs) {
      return
    }
    for (const key of strs) {
      const fn = config.actions?.[key]
      if (fn) {
        fn(getParams.current())
      }
    }
  }

  const state = useBindable(() => ({
    defaultValue: config.initialState({prop}),
    name: "state",
    onChange(nextState, details: unknown, prevState) {
      // exit effects
      if (prevState) {
        const exitEffects = effects.current.get(prevState)
        exitEffects?.()
        effects.current.delete(prevState)
      }

      // exit actions
      if (prevState) {
        action(config.states[prevState]?.exit)
      }

      // transition actions
      action(transitionRef.current?.actions)

      // enter effect
      const cleanup = effect(config.states[nextState]?.effects)
      if (cleanup) {
        effects.current.set(nextState as string, cleanup)
      }

      // root entry actions
      if (prevState === "__init__") {
        action(config.onInit?.actions || [])
        const cleanup = effect(config.onInit?.effects || [])
        if (cleanup) {
          effects.current.set("__init__", cleanup)
        }
      }

      // enter actions
      action(config.states[nextState]?.entry)
    },
  }))

  const getCurrentState = (): T["state"] => {
    if ("ref" in state) {
      return state.ref.current
    }
    return (state as unknown as Bindable<string, void>).get()
  }

  const previousEventRef = useRef<any>(null)
  const eventRef = useRef<any>({type: ""})

  const getEvent = () => ({
    ...eventRef.current,
    current() {
      return eventRef.current
    },
    previous() {
      return previousEventRef.current
    },
  })

  const send = (event: EventType<T>) => {
    queueMicrotask(() => {
      previousEventRef.current = eventRef.current
      eventRef.current = event
      const currentState = getCurrentState()

      const transitions =
        config.states[currentState]?.on?.[event.type] ?? config.on?.[event.type]

      const transition = choose(transitions)

      if (!transition) {
        return
      }

      // save current transition
      transitionRef.current = transition
      const target = transition.target ?? currentState
      const changed = target !== currentState

      debug(
        "transition",
        event.type,
        transition.target || currentState,
        `(${transition.actions})`,
      )

      if (changed) {
        // state change is high priority
        flushSync(() => state.set(target))
      } else if (transition.reenter && !changed) {
        // reenter will re-invoke the current state
        state.invoke(currentState, currentState)
      } else {
        // call transition actions
        action(transition.actions ?? [])
      }
    })
  }

  // improve HMR (to restart effects)
  const hydratedStateRef = useRef<string | undefined>(undefined)
  const statusRef = useRef<MachineStatus>(MachineStatus.NOT_STARTED)

  useSafeLayoutEffect(() => {
    queueMicrotask(() => {
      const started = statusRef.current === MachineStatus.STARTED
      statusRef.current = MachineStatus.STARTED
      debug(started ? "rehydrating..." : "initializing...")

      // start the transition
      const initialState = hydratedStateRef.current ?? state.initial!
      state.invoke(initialState, started ? state.get() : INIT_STATE)
    })
    const fns = effects.current
    const currentState = state.ref.current
    return () => {
      debug("unmounting...")
      hydratedStateRef.current = currentState
      statusRef.current = MachineStatus.STOPPED
      fns.forEach((fn) => fn?.())
      effects.current = new Map()
      transitionRef.current = null
      queueMicrotask(() => {
        action(config.onDestroy?.actions)
      })
    }
  }, [])

  const getParams = useRef(
    (): Params<T> => ({
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
      scope: {...scope, ids: ids.current},
      send: send as SendFn<T>,
      state: getState(),
      track: useTrack,
    }),
  )

  config.watch?.(getParams.current() as WatchParams<T>)

  return {
    computed,
    context,
    event: getEvent(),
    prop,
    refs,
    scope: {...scope, ids: ids.current},
    send: send as SendFn<T>,
    state: getState(),
  }
}

function useRefs<T>(refs: T) {
  const ref = useRef(refs)
  return {
    get<K extends keyof T>(key: K): T[K] {
      return ref.current[key]
    },
    set<K extends keyof T>(key: K, value: T[K]) {
      ref.current[key] = value
    },
  }
}

function flush(fn: VoidFunction) {
  queueMicrotask(() => {
    flushSync(() => fn())
  })
}
