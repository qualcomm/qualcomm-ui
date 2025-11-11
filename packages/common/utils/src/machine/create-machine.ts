import type {
  GuardFn,
  MachineConfig,
  MachineSchema,
  Params,
  Transition,
} from "./machine.types"

export const INIT_STATE = "__init__"

export const MachineStatus = {
  NOT_STARTED: "not-started",
  STARTED: "started",
  STOPPED: "stopped",
} as const

export type MachineStatus = (typeof MachineStatus)[keyof typeof MachineStatus]

export function createGuards<T extends MachineSchema>() {
  return {
    and: <K extends keyof T["guards"]>(...guards: Array<GuardFn<T> | K>) => {
      return function andGuard(params: Params<T>): boolean {
        return guards.every((str) => params.guard(str))
      }
    },
    not: <K extends keyof T["guards"]>(guard: GuardFn<T> | K) => {
      return function notGuard(params: Params<T>): boolean {
        return !params.guard(guard)
      }
    },
    or: <K extends keyof T["guards"]>(...guards: Array<GuardFn<T> | K>) => {
      return function orGuard(params: Params<T>): boolean {
        return guards.some((str) => params.guard(str))
      }
    },
  }
}

export function createMachine<T extends MachineSchema>(
  config: MachineConfig<T>,
): MachineConfig<T> {
  return config
}

export function createChoose<T extends MachineSchema>(
  transitions: Transition<T> | Transition<T>[],
): ({choose}: Params<T>) => (keyof T["actions"])[] | undefined {
  return function chooseFn({choose}: Params<T>) {
    return choose(transitions)?.actions
  }
}
