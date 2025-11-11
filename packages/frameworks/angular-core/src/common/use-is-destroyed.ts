import {DestroyRef, inject} from "@angular/core"

/**
 * Creates a utility that provides a check for whether a component has been
 * destroyed.
 *
 * @returns A single method for checking the destroy status of the component.
 */
export function useIsDestroyed(): () => boolean {
  const destroyRef = inject(DestroyRef)
  let destroyed = false
  destroyRef.onDestroy(() => {
    destroyed = true
  })
  return () => {
    return destroyed
  }
}
