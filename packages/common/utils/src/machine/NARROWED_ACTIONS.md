# Narrowed Action Event Types

## Problem

Action handlers in machine configs receive `Params<T>` where `event` is the full union of all possible events (`EventType<T>`). This forces manual type guards:

```typescript
selectItem: ({event}) => {
  if (event.type !== "ITEM.SELECT" && event.type !== "ITEM.CLICK") return
  event.value // only now narrowed
}
```

The event-to-action mapping already exists in the config's `on` and `states.*.on` fields. `createNarrowedMachine` extracts it at the type level so action handlers receive a narrowed `event` automatically.

## Usage

```typescript
import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

// 1. Extract transitions into a separate const.
//    `satisfies` validates against the schema while preserving literal types.
const transitions = {
  context({bindable, prop}) {
    // ...
  },
  initialState() {
    return "idle"
  },
  on: {
    "PRESS.SET": {actions: ["setPressed"]},
    "PRESS.TOGGLE": {actions: ["togglePressed"]},
  },
  props({props}) {
    // ...
  },
  states: {idle: {}},
} satisfies MachineConfigBase<ToggleSchema>

// 2. Pass transitions + actions to createNarrowedMachine.
//    event is automatically narrowed per action.
export const toggleMachine: MachineConfig<ToggleSchema> =
  createNarrowedMachine<ToggleSchema>()(transitions, {
    setPressed({context, event}) {
      // event is narrowed to { type: "PRESS.SET"; value: boolean | undefined }
      context.set("pressed", event.value || false)
    },
    togglePressed({context}) {
      context.set("pressed", !context.get("pressed"))
    },
  })
```

Machines that don't need narrowing keep using `createMachine` as before.

## Constraints and Nuances

Three TypeScript constraints force this design:

### 1. Curried call: `createNarrowedMachine<T>()(base, actions)`

TypeScript's "all or nothing" rule for explicit type arguments means you cannot provide `T` (the schema) explicitly while letting `TConfig` (the literal config type) be inferred in the same call. Splitting into two calls resolves this:

- Outer call `<ToggleSchema>()` fixes `T`
- Inner call `(base, actions)` infers `TConfig` with `const`

This is the same pattern used by `createGuards<T>()` in this codebase.

### 2. Split constant: `transitions` declared separately from `actions`

The `actions` field and the `on`/`states.*.on` fields are siblings in the same object. To narrow action params based on `on`, TypeScript must resolve the `on` types first. When both live in the same object literal and are passed as a single argument, TypeScript cannot infer `TConfig` from the `on` fields independently of the `actions` fields -- inference happens simultaneously, producing `any`.

Splitting into two arguments (`base`, `actions`) ensures `TConfig` is fully resolved from `base` before TypeScript contextually types `actions`.

### 3. Internal cast: `as unknown as MachineConfig<T>`

A narrowed action `(params: NarrowedParams<...>) => void` is not assignable to the wider `(params: Params<T>) => void` under `strictFunctionTypes`. This is contravariance: `NarrowedParams` has a narrower `event` type, making the function accept a more specific input, which makes it a wider function type. The cast inside `createNarrowedMachine` bridges this gap so the result satisfies `MachineConfig<T>`.

## How the type extraction works

Given the literal config type from the `transitions` constant:

1. `EventsForAction<TConfig, "selectItem">` walks `on` and `states.*.on`, checking which event keys have `"selectItem"` in their `actions` arrays. Returns the union of matching event type strings.

2. `NonTransitionActions<TConfig>` extracts action names from `entry`/`exit` arrays across all states. These actions can be triggered by any event (whatever caused the state transition), so they fall back to the full `EventType<T>`.

3. `NarrowedParams<T, TConfig, K>` replaces `event` in `Params<T>` with `Extract<EventType<T>, {type: EventsForAction<TConfig, K>}>` -- the subset of events that actually trigger action `K`.

Actions not found in any `on` transition (e.g. only called from `watch`) also fall back to full `EventType<T>`.

## Utility types

Available for external use (tests, API layer, documentation):

```typescript
import type {EventsForAction, ActionsForEvent} from "@qualcomm-ui/utils/machine"

// Which events trigger selectItem?
type E = EventsForAction<typeof transitions, "selectItem">
// = "ITEM.SELECT" | "ITEM.CLICK"

// Which actions does ITEM.CLICK trigger?
type A = ActionsForEvent<typeof transitions, "ITEM.CLICK">
// = "selectItem" | "invokeOnClose" | "setFinalFocus"
```

## Limitations

- **`entry`/`exit` as functions**: When entry/exit uses `createChoose` (a function, not a string array), the action names cannot be extracted statically. Those actions receive whatever narrowing `on` provides, which may be too narrow if the action is also triggered by entry/exit.
- **`watch` actions**: Actions called via `action(["..."])` inside `watch` are invisible to the type system. If such an action also appears in `on` transitions, its narrowing is based solely on those transitions.
- **`onInit.actions` with `as any` casts**: Arrays containing `createChoose(...) as any` can pollute extraction with `any`, causing all actions to lose narrowing. This is mitigated by not extracting from `onInit` currently.
