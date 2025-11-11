import {
  act,
  createContext,
  type ReactElement,
  useContext,
  useState,
} from "react"

import {page} from "@vitest/browser/context"
import {describe, expect, test, vi} from "vitest"
import {render, renderHook} from "vitest-browser-react"

import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {
  type ActionSchema,
  type AsyncSendFn,
  createGuards,
  createMachine,
  type EffectSchema,
  type EventType,
  type GuardSchema,
  type Machine,
  type MachineConfig,
  type MachineSchema,
} from "@qualcomm-ui/utils/machine"

import {useMachine} from "./use-machine"

function getGlobalThis(): any {
  if (typeof globalThis !== "undefined") {
    return globalThis
  }
  if (typeof self !== "undefined") {
    return self
  }
  if (typeof window !== "undefined") {
    return window
  }
  if (typeof global !== "undefined") {
    return global
  }
  throw new Error("unable to locate global object")
}

async function renderMachine<T extends MachineSchema>(
  machine: MachineConfig<T>,
) {
  const render = renderHook(() => useMachine<T>(machine))

  getGlobalThis().IS_REACT_ACT_ENVIRONMENT = true

  // Use the new AsyncSendFn type for the wrapper function
  const send = async (event: EventType<NonNullable<any>>): Promise<void> => {
    // Implementation remains async
    await act(async () => {
      // Call the machine's original send function (which returns void)
      // Type assertion needed for spreading args into the overloaded function
      render.result.current.send(event)
    })
  }

  const advanceTime = async (ms: number) => {
    await act(async () => {
      vi.advanceTimersByTime(ms)
    })
  }
  return {...render, advanceTime, send: send as unknown as AsyncSendFn<T>}
}

describe("basic", () => {
  test("initial state", async () => {
    interface Schema extends MachineSchema {
      state: "foo" | "bar"
    }

    const machine = createMachine<Schema>({
      initialState() {
        return "foo"
      },
      states: {
        bar: {},
        foo: {
          on: {
            NEXT: {target: "bar"},
          },
        },
      },
    })

    const {result} = await renderMachine(machine)

    expect(result.current.state.get()).toBe("foo")
  })

  test("initial entry action", async () => {
    const fooEntry = vi.fn()
    const rootEntry = vi.fn()

    interface Schema extends MachineSchema {
      actions: {
        fooEntry: () => void
        rootEntry: () => void
      }
      state: "foo"
    }

    const machine = createMachine<Schema>({
      actions: {
        fooEntry,
        rootEntry,
      },
      initialActions: ["rootEntry"],
      initialState: () => "foo",
      states: {
        foo: {
          entry: ["fooEntry"],
        },
      },
    })

    renderMachine(machine)
    await Promise.resolve()

    expect(fooEntry).toHaveBeenCalledOnce()
    expect(rootEntry).toHaveBeenCalledOnce()
  })

  test("current state and context", async () => {
    interface Schema extends MachineSchema {
      context: {
        foo: [string]
      }
      state: "test"
    }

    const machine = createMachine<Schema>({
      context({bindable}) {
        return {foo: bindable(() => ({defaultValue: "bar"}))}
      },
      initialState() {
        return "test"
      },
      states: {
        test: {},
      },
    })

    const {result} = await renderMachine(machine)

    expect(result.current.state.get()).toEqual("test")
    expect(result.current.context.get("foo")).toEqual("bar")
  })

  test("send event", async () => {
    const done = vi.fn()

    interface Schema extends MachineSchema {
      actions: {
        done: () => void
      }
      context: {
        foo: string
      }
      events: {
        type: "CHANGE"
      }
      state: "test" | "success"
    }

    const machine = createMachine<Schema>({
      actions: {
        done,
      },

      context({bindable}) {
        return {foo: bindable(() => ({defaultValue: "bar"}))}
      },

      initialState() {
        return "test"
      },
      states: {
        success: {
          entry: ["done"],
        },
        test: {
          on: {
            CHANGE: {target: "success"},
          },
        },
      },
    })

    const {send} = await renderMachine(machine)

    await send({type: "CHANGE"})
    expect(done).toHaveBeenCalledOnce()
  })

  test("state tags", async () => {
    interface Schema extends MachineSchema {
      events: {
        type: "TIMER"
      }
      state: "green" | "red" | "yellow"
    }

    const machine = createMachine<Schema>({
      initialState() {
        return "green"
      },
      states: {
        green: {
          on: {
            TIMER: {
              target: "yellow",
            },
          },
          tags: ["go"],
        },
        red: {
          tags: ["stop"],
        },
        yellow: {
          on: {
            TIMER: {
              target: "red",
            },
          },
          tags: ["go"],
        },
      },
    })

    const {result, send} = await renderMachine(machine)

    expect(result.current.state.hasTag("go")).toBeTruthy()

    await send({type: "TIMER"})
    expect(result.current.state.get()).toBe("yellow")
    expect(result.current.state.hasTag("go")).toBeTruthy()

    await send({type: "TIMER"})
    expect(result.current.state.get()).toBe("red")
    expect(result.current.state.hasTag("go")).toBeFalsy()
  })

  test("action order", async () => {
    interface Schema extends MachineSchema {
      actions: ActionSchema<"entry2" | "exit1" | "nextActions">
      events: {type: "NEXT"}
      state: "test" | "success"
    }

    const order = new Set<string>()
    const call = (key: string) => () => order.add(key)
    const machine = createMachine<Schema>({
      actions: {
        entry2: call("entry2"),
        exit1: call("exit1"),
        nextActions: call("transition"),
      },
      initialState() {
        return "test"
      },
      states: {
        success: {
          entry: ["entry2"],
        },
        test: {
          exit: ["exit1"],
          on: {
            NEXT: {actions: ["nextActions"], target: "success"},
          },
        },
      },
    })

    const {send} = await renderMachine(machine)

    await send({type: "NEXT"})
    expect([...order]).toEqual(["exit1", "transition", "entry2"])
  })

  test("computed", async () => {
    interface Schema extends MachineSchema {
      actions: ActionSchema<"setValue">
      computed: {
        length: number
      }
      context: {
        value: string
      }
      events: {type: "UPDATE"}
      state: "test"
    }

    const machine = createMachine<Schema>({
      actions: {
        setValue: ({context}) => context.set("value", "hello"),
      },
      computed: {
        length: ({context}) => context.get("value").length,
      },
      context({bindable}) {
        return {value: bindable(() => ({defaultValue: "bar"}))}
      },
      initialState() {
        return "test"
      },
      states: {
        test: {
          on: {
            UPDATE: {
              actions: ["setValue"],
            },
          },
        },
      },
    })

    const {result, send} = await renderMachine(machine)
    expect(result.current.computed("length")).toEqual(3)

    await send({type: "UPDATE"})
    expect(result.current.computed("length")).toEqual(5)
  })

  test("watch", async () => {
    interface Schema extends MachineSchema {
      actions: ActionSchema<"notify" | "setValue">
      context: {
        value: string
      }
      events: {
        type: "UPDATE"
      }
      state: "test"
    }

    const notify = vi.fn()
    const machine = createMachine<Schema>({
      actions: {
        notify,
        setValue: ({context}) => context.set("value", "hello"),
      },
      context({bindable}) {
        return {value: bindable(() => ({defaultValue: "bar"}))}
      },
      initialState() {
        return "test"
      },
      states: {
        test: {
          on: {
            UPDATE: {
              actions: ["setValue"],
            },
          },
        },
      },
      watch({actions, context, track}) {
        track([() => context.get("value")], () => {
          actions["notify"]()
        })
      },
    })

    const {send} = await renderMachine(machine)

    // send update twice and expect notify to be called once (since the value is the
    // same)
    await send({type: "UPDATE"})
    await send({type: "UPDATE"})
    expect(notify).toHaveBeenCalledOnce()
  })

  test("guard: basic", async () => {
    interface Schema extends MachineSchema {
      actions: ActionSchema<"increment">
      context: {
        count: number
      }
      events: {
        type: "INCREMENT"
      }
      guards: GuardSchema<"isBelowMax">
      props: {
        max: number
      }
      state: "test"
    }

    const machine = createMachine<Schema>({
      actions: {
        increment: ({context}) =>
          context.set("count", context.get("count") + 1),
      },

      context({bindable}) {
        return {count: bindable(() => ({defaultValue: 0}))}
      },

      guards: {
        isBelowMax: ({context, prop}) => prop("max") > context.get("count"),
      },

      initialState() {
        return "test"
      },

      props() {
        return {max: 1}
      },

      states: {
        test: {
          on: {
            INCREMENT: {
              actions: ["increment"],
              guard: "isBelowMax",
            },
          },
        },
      },
    })

    const {result, send} = await renderMachine(machine)

    await send({type: "INCREMENT"})
    expect(result.current.context.get("count")).toEqual(1)

    await send({type: "INCREMENT"})
    expect(result.current.context.get("count")).toEqual(1)
  })

  test("guard: composition", async () => {
    interface Schema extends MachineSchema {
      actions: ActionSchema<"increment" | "setValue">
      context: {
        count: number
      }
      events:
        | {
            type: "COUNT.SET"
            value: number
          }
        | {type: "INCREMENT"}
      guards: GuardSchema<"isAboveMin" | "isBelowMax">
      props: {
        max: number
        min: number
      }
      state: "test"
    }

    const {and} = createGuards<Schema>()
    const machine = createMachine<Schema>({
      actions: {
        increment: ({context}) =>
          context.set("count", context.get("count") + 1),
        setValue: ({context, event}) => {
          if (!("value" in event)) {
            return
          }
          context.set("count", event.value)
        },
      },
      context({bindable}) {
        return {count: bindable(() => ({defaultValue: 0}))}
      },
      guards: {
        isAboveMin: ({context, prop}) => prop("min") < context.get("count"),
        isBelowMax: ({context, prop}) => prop("max") > context.get("count"),
      },
      initialState() {
        return "test"
      },

      props() {
        return {max: 3, min: 1}
      },

      states: {
        test: {
          on: {
            "COUNT.SET": {
              actions: ["setValue"],
            },
            INCREMENT: {
              actions: ["increment"],
              guard: and("isBelowMax", "isAboveMin"),
            },
          },
        },
      },
    })

    const {result, send} = await renderMachine(machine)

    await send({type: "INCREMENT"})
    expect(result.current.context.get("count")).toEqual(0)

    await send({type: "COUNT.SET", value: 2})
    expect(result.current.context.get("count")).toEqual(2)

    await send({type: "INCREMENT"})
    expect(result.current.context.get("count")).toEqual(3)
  })

  test("context: controlled", async () => {
    interface Schema extends MachineSchema {
      actions: ActionSchema<"setValue">
      context: {
        value: [string]
      }
      events: {
        type: "VALUE.SET"
        value: string
      }
      props: {
        defaultValue: string
        value: string
      }
      state: "test"
    }

    const machine = createMachine<Schema>({
      actions: {
        setValue: ({context, event}) => {
          if (!("value" in event)) {
            return
          }
          context.set("value", event.value)
        },
      },

      context({bindable, prop}) {
        return {
          value: bindable(() => ({
            defaultValue: prop("defaultValue"),
            value: prop("value"),
          })),
        }
      },

      initialState() {
        return "test"
      },

      props() {
        return {defaultValue: "", value: "foo"}
      },

      states: {
        test: {
          on: {
            "VALUE.SET": {
              actions: ["setValue"],
            },
          },
        },
      },
    })

    const {result, send} = await renderMachine(machine)

    await send({type: "VALUE.SET", value: "next"})

    // since value is controlled, it should not change
    expect(result.current.context.get("value")).toEqual("foo")
  })

  test("effects", async () => {
    interface Schema extends MachineSchema {
      effects: EffectSchema<"waitForMs">
      events: {
        type: "DONE" | "START"
      }
      state: "test" | "success"
    }

    vi.useFakeTimers()

    const cleanup = vi.fn()
    const machine = createMachine<Schema>({
      effects: {
        waitForMs({send}) {
          const id = setTimeout(() => {
            send({type: "DONE"})
          }, 1000)
          return () => {
            cleanup()
            clearTimeout(id)
          }
        },
      },
      initialState() {
        return "test"
      },
      states: {
        success: {},
        test: {
          effects: ["waitForMs"],
          on: {
            DONE: {target: "success"},
          },
        },
      },
    })

    const {advanceTime, result, send} = await renderMachine(machine)

    await send({type: "START"})
    expect(result.current.state.get()).toEqual("test")

    await advanceTime(1000)
    expect(result.current.state.get()).toEqual("success")
    expect(cleanup).toHaveBeenCalledOnce()

    vi.useRealTimers()
  })

  test("ids: destroy cleanup", async () => {
    interface Schema extends MachineSchema {
      ids: {
        label: string
        root: string
      }
      state: "idle"
    }

    const machineConfig = createMachine<Schema>({
      ids: ({bindableId}) => ({
        label: bindableId<string>(),
        root: bindableId<string>(),
      }),
      initialState() {
        return "idle"
      },
      states: {
        idle: {},
      },
    })

    function createApi(machine: Machine<Schema>) {
      const {scope} = machine
      return {
        getIconProps: (id: string) => {
          scope.ids.register("root", id)
          return {
            "aria-labelledby": scope.ids.get("label"),
            id,
          }
        },
        getLabelProps: (
          id: string,
          onDestroy: (callback: () => void) => void,
        ) => {
          scope.ids.register("label", id, onDestroy)
          return {
            id,
          }
        },
      }
    }

    const ApiContext = createContext<ReturnType<typeof createApi> | null>(null)

    const text = {
      icon: "Icon",
      increment: "Increment",
      label: "Label",
    }

    function TestLabel({id}: {id: string}): ReactElement {
      const api = useContext(ApiContext)
      const onDestroy = useOnDestroy()

      return <div {...api!.getLabelProps(id, onDestroy)}>{text.label}</div>
    }

    function TestComponent() {
      const [count, setCount] = useState<number>(2)
      const machine = useMachine(machineConfig)
      const api = createApi(machine)

      return (
        <ApiContext.Provider value={api}>
          <div {...api.getIconProps("root-id")}>{text.icon}</div>
          {count % 2 === 0 ? <TestLabel id={`${count}`} /> : null}

          <button onClick={() => setCount((prevState) => prevState + 1)}>
            {text.increment}
          </button>
        </ApiContext.Provider>
      )
    }

    render(<TestComponent />)

    await expect.element(page.getByText(text.label)).toHaveAttribute("id", "2")
    await expect
      .element(page.getByText(text.icon))
      .toHaveAttribute("aria-labelledby", "2")
    await page.getByText(text.increment).click()
    await expect
      .element(page.getByText(text.icon))
      .not.toHaveAttribute("aria-labelledby")
    await page.getByText(text.increment).click()
    await expect.element(page.getByText(text.label)).toHaveAttribute("id", "4")
    await expect
      .element(page.getByText(text.icon))
      .toHaveAttribute("aria-labelledby", "4")
  })

  test("ids: collection", async () => {
    interface Schema extends MachineSchema {
      ids: {
        items: string[] // collection
        root: string
      }
      state: "idle"
    }

    const machine = createMachine<Schema>({
      ids: ({bindableId, bindableIdCollection}) => ({
        items: bindableIdCollection<string>(),
        root: bindableId<string>(),
      }),
      initialState() {
        return "idle"
      },
      states: {
        idle: {},
      },
    })

    const {result} = await renderMachine(machine)

    // single ID still works
    result.current.scope.ids.register("root", "root-id")
    expect(result.current.scope.ids.get("root")).toBe("root-id")

    const collection = result.current.scope.ids.collection("items")

    collection.register("item-1", "id-1")
    collection.register("item-2", "id-2")

    expect(collection.get("item-1")).toBe("id-1")
    expect(collection.get("item-2")).toBe("id-2")
    expect(collection.get("item-3")).toBeUndefined()

    expect(collection.getAll()).toEqual({
      "item-1": "id-1",
      "item-2": "id-2",
    })

    expect(collection.keys()).toEqual(["item-1", "item-2"])

    collection.set("item-1", "new-id-1")
    expect(collection.get("item-1")).toBe("new-id-1")

    collection.remove("item-1")
    expect(collection.get("item-1")).toBeUndefined()
    expect(collection.keys()).toEqual(["item-2"])
  })

  test("ids: collection with cleanup", async () => {
    interface Schema extends MachineSchema {
      ids: {
        items: string[]
      }
      state: "idle"
    }

    const machine = createMachine<Schema>({
      ids: ({bindableIdCollection}) => ({
        items: bindableIdCollection<string>(),
      }),
      initialState() {
        return "idle"
      },
      states: {
        idle: {},
      },
    })

    const {result} = await renderMachine(machine)

    const collection = result.current.scope.ids.collection("items")
    const cleanup = vi.fn()

    collection.register("item-1", "id-1", cleanup)

    expect(collection.get("item-1")).toBe("id-1")

    collection.remove("item-1")
    expect(cleanup).toHaveBeenCalledOnce()
    expect(collection.get("item-1")).toBeUndefined()
  })
})
