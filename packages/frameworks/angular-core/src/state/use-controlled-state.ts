import {computed, signal, type Signal} from "@angular/core"

interface ControlledStateOptions<T> {
  defaultValue?: Signal<T | undefined> | T | undefined
  onChange?: ((value: T, ...rest: any[]) => void) | undefined
  value?: Signal<T | undefined>
}

export interface ControlledState<T> {
  setValue: (newValue: T, ...rest: any[]) => void
  value: Signal<T | undefined>
}

export function useControlledState<T>(
  options: ControlledStateOptions<T>,
): Signal<ControlledState<T>> {
  const {defaultValue, onChange, value: controlledValue} = options

  return computed(() => {
    const isControlled = controlledValue?.() !== undefined
    const localValue = signal<T | undefined>(access(defaultValue))

    const value = isControlled ? controlledValue : localValue.asReadonly()

    const setValue = (newValue: T, ...rest: any[]) => {
      onChange?.(newValue, ...rest)
      if (!isControlled) {
        localValue.set(newValue)
      }
    }

    return {setValue, value} as ControlledState<T>
  })
}

function access<T>(value: Signal<T> | T | undefined): T | undefined {
  if (value === undefined) {
    return undefined
  }
  if (typeof value === "function") {
    return (value as unknown as Signal<T>)()
  }
  return value as T
}
