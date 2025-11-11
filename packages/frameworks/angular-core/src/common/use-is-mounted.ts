import {useIsDestroyed} from "./use-is-destroyed"

/**
 * Creates a utility that provides a check for whether a component is still mounted.
 *
 * @returns A single method for checking the status of the component.
 */
export function useIsMounted(): () => boolean {
  const isDestroyed = useIsDestroyed()
  return () => {
    return !isDestroyed()
  }
}
