import {Component, computed, inject, Injector, type OnInit} from "@angular/core"
import {render, waitFor} from "@testing-library/angular"
import {page} from "@vitest/browser/context"
import {describe, expect, test, vi} from "vitest"

import {
  type ActionSchema,
  createGuards,
  createMachine,
  type EffectSchema,
  type GuardSchema,
  type Machine,
  type MachineConfig,
  type MachineSchema,
} from "@qualcomm-ui/utils/machine"

import {useMachine} from "./use-machine"

async function renderMachine<T extends MachineSchema>(
  machine: MachineConfig<T>,
) {
  @Component({
    selector: "lightswitch-comp",
    template: `
      <span>test-component</span>
    `,
  })
  class TestComponent implements OnInit {
    api: Machine<T>

    injector = inject(Injector)

    ngOnInit() {
      const api = useMachine(
        machine,
        computed(() => ({})),
        this.injector,
      )

      this.api = api
    }
  }

  const advanceTime = async (ms: number) => {
    vi.advanceTimersByTime(ms)
  }

  const res = await render(TestComponent)
  await expect.element(page.getByText("test-component")).toBeVisible()
  return {...res.fixture.componentInstance.api, advanceTime}
}

describe("Machine", () => {
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

    const result = await renderMachine(machine)

    expect(result.state.get()).toBe("foo")
  })

  test("initial entry action", async () => {
    interface Schema extends MachineSchema {
      actions: {
        fooEntry: () => void
        rootEntry: () => void
      }
      state: "foo"
    }

    const fooEntry = vi.fn()
    const rootEntry = vi.fn()

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

    await renderMachine(machine)
    await Promise.resolve()

    // init effects are async and only happen after the first render
    await expect.poll(() => fooEntry).toHaveBeenCalledOnce()
    await expect.poll(() => rootEntry).toHaveBeenCalledOnce()
  })

  test("current state and context", async () => {
    interface Schema extends MachineSchema {
      context: {
        foo: [string, void]
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

    const api = await renderMachine(machine)

    expect(api.state.get()).toEqual("test")
    expect(api.context.get("foo")).toEqual("bar")
  })

  test("send event", async () => {
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

    const done = vi.fn()

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

    send({type: "CHANGE"})
    await expect.poll(() => done).toHaveBeenCalledOnce()
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

    const {send, state} = await renderMachine(machine)

    expect(state.hasTag("go")).toBeTruthy()

    send({type: "TIMER"})
    await expect.poll(() => state.get()).toBe("yellow")
    expect(state.hasTag("go")).toBeTruthy()

    send({type: "TIMER"})
    await expect.poll(() => state.get()).toBe("red")
    expect(state.hasTag("go")).toBeFalsy()
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

    send({type: "NEXT"})
    await expect
      .poll(() => [...order])
      .toEqual(["exit1", "transition", "entry2"])
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

    const {computed, send} = await renderMachine(machine)
    expect(computed("length")).toEqual(3)

    send({type: "UPDATE"})
    await expect.poll(() => computed("length")).toEqual(5)
  })

  test("watch", async () => {
    interface Schema extends MachineSchema {
      actions: ActionSchema<"notify" | "setValue">
      context: {
        value: string
      }
      events: {
        type: "UPDATE"
        value: string
      }
      state: "test"
    }

    const notify = vi.fn()
    const onChangeFn = vi.fn()
    const setValue = vi.fn()
    const machine = createMachine<Schema>({
      actions: {
        notify,
        setValue: ({context, event}) => {
          setValue(event.value)
          context.set("value", event.value)
        },
      },
      context({bindable}) {
        return {
          value: bindable(() => ({
            defaultValue: "bar",
            onChange: onChangeFn,
            value: undefined,
          })),
        }
      },
      initialState() {
        return "test"
      },
      on: {
        UPDATE: {
          actions: ["setValue"],
        },
      },
      states: {
        test: {},
      },
      watch({actions, context, track}) {
        track([() => context.get("value")], () => {
          actions.notify()
        })
      },
    })

    const {send} = await renderMachine(machine)

    send({type: "UPDATE", value: "test1"})
    await expect.poll(() => setValue).toHaveBeenCalledWith("test1")
    await expect
      .poll(() => onChangeFn)
      .toHaveBeenCalledWith("test1", undefined, "bar")
    send({type: "UPDATE", value: "test2"})
    await expect.poll(() => setValue).toHaveBeenCalledWith("test2")
    await expect
      .poll(() => onChangeFn)
      .toHaveBeenCalledWith("test2", undefined, "test1")
    await waitFor(() => expect(notify).toHaveBeenCalled())
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

    const {context, send} = await renderMachine(machine)

    send({type: "INCREMENT"})
    await expect.poll(() => context.get("count")).toEqual(1)

    send({type: "INCREMENT"})
    await expect.poll(() => context.get("count")).toEqual(1)
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
          if ("value" in event) {
            context.set("count", event.value)
          }
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

    const {context, send} = await renderMachine(machine)

    send({type: "INCREMENT"})
    await expect.poll(() => context.get("count")).toEqual(0)

    send({type: "COUNT.SET", value: 2})
    await expect.poll(() => context.get("count")).toEqual(2)

    send({type: "INCREMENT"})
    await expect.poll(() => context.get("count")).toEqual(3)
  })

  test("context: controlled", async () => {
    interface Schema extends MachineSchema {
      actions: ActionSchema<"setValue">
      context: {
        value: string
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
        setValue: ({context, event}) => context.set("value", event.value),
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

    const {context, send} = await renderMachine(machine)

    send({type: "VALUE.SET", value: "next"})

    // since value is controlled, it should not change
    await expect.poll(() => context.get("value")).toEqual("foo")
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

    const {advanceTime, send, state} = await renderMachine(machine)

    send({type: "START"})
    await expect.poll(() => state.get()).toEqual("test")

    await advanceTime(1000)
    await expect.poll(() => state.get()).toEqual("success")
    expect(cleanup).toHaveBeenCalledOnce()

    vi.useRealTimers()
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

    const api = await renderMachine(machine)

    // single ID still works
    api.scope.ids.register("root", "root-id")
    expect(api.scope.ids.get("root")).toBe("root-id")

    const collection = api.scope.ids.collection("items")

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

    const api = await renderMachine(machine)

    const collection = api.scope.ids.collection("items")

    collection.register("item-1", "id-1")
    expect(collection.get("item-1")).toBe("id-1")

    collection.remove("item-1")
    expect(collection.get("item-1")).toBeUndefined()
  })
})
