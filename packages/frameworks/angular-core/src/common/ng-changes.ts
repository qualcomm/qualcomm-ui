// A utility type for typing the SimpleChanges property from Angular.
// The only drawback is that we'll also get autocompletion for other public

import type {Signal} from "@angular/core"

// properties in our component
export type NgChanges<Component> = {
  [Key in keyof Component]: Component[Key] extends Signal<infer T>
    ? {
        currentValue: T
        firstChange: boolean
        isFirstChange(): boolean
        previousValue: T
      }
    : {
        currentValue: Component[Key]
        firstChange: boolean
        isFirstChange(): boolean
        previousValue: Component[Key]
      }
}

export type NgChangesAllProps<Component> = {[Key in keyof Component]: Key}
