import {isEqual} from "@qui/utils/equal"

/**
 * Utility type to ensure an array is treated as a fixed-length tuple
 */
type AsTuple<T extends readonly unknown[]> = [...T]

/**
 * Creates a memoized version of a function that only recalculates its result
 * when its dependencies change.
 *
 * @param getDeps Function that extracts dependencies from the provided arguments
 * @param fn Function to memoize that takes the dependencies as arguments
 * @param opts Optional configuration
 * @returns Memoized function
 */
export function memo<TDepArgs, TResult, TDeps extends readonly unknown[]>(
  getDeps: (depArgs: TDepArgs) => AsTuple<TDeps>,
  fn: (...args: TDeps) => TResult,
  opts?: {
    onChange?: (result: TResult) => void
  },
): (depArgs: TDepArgs) => TResult {
  let deps: TDeps | undefined
  let result: TResult | undefined

  return (depArgs: TDepArgs) => {
    const newDeps = getDeps(depArgs) as TDeps
    const depsChanged =
      !deps ||
      newDeps.length !== deps.length ||
      newDeps.some((dep, index) => !isEqual(deps?.[index], dep))

    if (!depsChanged && result !== undefined) {
      return result
    }

    deps = newDeps
    result = fn(...newDeps)
    opts?.onChange?.(result)
    return result
  }
}
