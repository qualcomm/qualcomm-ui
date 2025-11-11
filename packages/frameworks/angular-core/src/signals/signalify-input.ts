import type {Signal} from "@angular/core"

import type {MaybeSignal} from "./signals.types"

export type SignalifyInput<T> = {
  [Key in keyof T as Key extends `on${string}` ? never : Key]-?: Signal<T[Key]>
}

export type MaybeSignalInput<T> = {
  [Key in keyof T as Key extends `on${string}` ? never : Key]-?: MaybeSignal<
    T[Key]
  >
}
