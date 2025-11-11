export function isFalsy<T>(parameter: T): boolean {
  return typeof parameter === "undefined" || parameter === null
}
