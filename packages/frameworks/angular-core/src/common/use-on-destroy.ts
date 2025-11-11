import {DestroyRef, inject} from "@angular/core"

/**
 * Creates a utility that provides component cleanup functionality
 * using Angular's DestroyRef.
 *
 * @returns A single method for registering a cleanup callback.
 */
export function useOnDestroy() {
  const destroyRef = inject(DestroyRef)

  return (callback: () => void): void => {
    destroyRef.onDestroy(callback)
  }
}
