/**
 * Converts a value to an array. Returns a new array.
 * @param v - The value to convert to an array
 */
export function toArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) {
    return []
  }
  return Array.isArray(v) ? v : [v]
}

/**
 * Creates an array of sequential numbers from 0 to length-1. Returns a new array.
 * @param length - The length of the array to create
 */
export function fromLength(length: number): number[] {
  return Array.from(Array(length).keys())
}

/**
 * Returns the first element of an array.
 * @param v - The array to get the first element from
 */
export function first<T>(v: T[]): T | undefined {
  return v[0]
}

/**
 * Returns the last element of an array.
 * @param v - The array to get the last element from
 */
export function last<T>(v: T[]): T | undefined {
  return v[v.length - 1]
}

/**
 * Checks if an array is empty.
 * @param v - The array to check
 */
export function isEmpty<T>(v: T[]): boolean {
  return v.length === 0
}

/**
 * Checks if an array contains a specific item.
 * @param v - The array to search in
 * @param t - The item to search for
 */
export function has<T>(v: T[], t: any): boolean {
  return v.indexOf(t) !== -1
}

/**
 * Returns a new array with items added to the end.
 * @param v - The original array
 * @param items - The items to add
 */
export function add<T>(v: T[], ...items: T[]): T[] {
  return v.concat(items)
}

/**
 * Returns a new array with specified items removed.
 * @param v - The original array
 * @param items - The items to remove
 */
export function remove<T>(v: T[], ...items: T[]): T[] {
  return v.filter((t) => !items.includes(t))
}

/**
 * Returns a new array with the item at the specified index removed.
 * @param v - The original array
 * @param i - The index of the item to remove
 */
export function removeAt<T>(v: T[], i: number): T[] {
  return v.filter((_, idx) => idx !== i)
}

/**
 * Returns a new array with items inserted at the specified index.
 * @param v - The original array
 * @param i - The index to insert at
 * @param items - The items to insert
 */
export function insertAt<T>(v: T[], i: number, ...items: T[]): T[] {
  return [...v.slice(0, i), ...items, ...v.slice(i)]
}

/**
 * Returns a new array with duplicate values removed.
 * @param v - The array to remove duplicates from
 */
export function uniq<T>(v: T[]): T[] {
  return Array.from(new Set(v))
}

/**
 * Adds an item to the array if it doesn't exist, or removes it if it does. Returns a new array.
 * @param v - The original array
 * @param item - The item to add or remove
 */
export function addOrRemove<T>(v: T[], item: T): T[] {
  if (has(v, item)) {
    return remove(v, item)
  }
  return add(v, item)
}

/**
 * Removes all elements from the array. MUTATES the original array.
 * @param v - The array to clear
 */
export function clear<T>(v: T[]): T[] {
  while (v.length > 0) {
    v.pop()
  }
  return v
}

export type IndexOptions = {
  loop?: boolean
  step?: number
}

/**
 * Calculates the next index in an array with optional looping and step size.
 * @param v - The array to navigate
 * @param idx - The current index
 * @param opts - Options for navigation behavior
 */
export function nextIndex<T>(
  v: T[],
  idx: number,
  opts: IndexOptions = {},
): number {
  const {loop = true, step = 1} = opts
  const next = idx + step
  const len = v.length
  const last = len - 1
  if (idx === -1) {
    return step > 0 ? 0 : last
  }
  if (next < 0) {
    return loop ? last : 0
  }
  if (next >= len) {
    return loop ? 0 : idx > len ? len : idx
  }
  return next
}

/**
 * Returns the next element in an array with optional looping and step size.
 * @param v - The array to navigate
 * @param idx - The current index
 * @param opts - Options for navigation behavior
 */
export function next<T>(
  v: T[],
  idx: number,
  opts: IndexOptions = {},
): T | undefined {
  return v[nextIndex(v, idx, opts)]
}

/**
 * Calculates the previous index in an array with optional looping and step size.
 * @param v - The array to navigate
 * @param idx - The current index
 * @param opts - Options for navigation behavior
 */
export function prevIndex<T>(
  v: T[],
  idx: number,
  opts: IndexOptions = {},
): number {
  const {loop = true, step = 1} = opts
  return nextIndex(v, idx, {loop, step: -step})
}

/**
 * Returns the previous element in an array with optional looping and step size.
 * @param v - The array to navigate
 * @param index - The current index
 * @param opts - Options for navigation behavior
 */
export function prev<T>(
  v: T[],
  index: number,
  opts: IndexOptions = {},
): T | undefined {
  return v[prevIndex(v, index, opts)]
}

/**
 * Splits an array into chunks of the specified size. Returns a new array.
 * @param v - The array to chunk
 * @param size - The size of each chunk
 */
export function chunk<T>(v: T[], size: number): T[][] {
  const res: T[][] = []
  return v.reduce((rows, value, index) => {
    if (index % size === 0) {
      rows.push([value])
    } else {
      last(rows)?.push(value)
    }
    return rows
  }, res)
}

/**
 * Recursively flattens a nested array. Returns a new array.
 * @param arr - The array to flatten
 */
export function flatArray<T>(arr: T[]): T[] {
  return arr.reduce<T[]>((flat, item) => {
    if (Array.isArray(item)) {
      return flat.concat(flatArray(item))
    }
    return flat.concat(item)
  }, [])
}

/**
 * Marshals a non-array field into an array, or returns the array
 */
export function ensureArray<T>(field: T | T[] = []): T[] {
  return Array.isArray(field) ? (field as unknown as T[]) : [field]
}

/**
 * Inserts an item in between each element of the passed array, returning a new
 * array in the process.
 *
 * @param array
 * @param item
 */
export function intersperse<T, K>(array: T[], item: K): (T | K)[] {
  return array.slice(1).reduce(
    (acc: (T | K)[], current) => {
      acc.push(item)
      acc.push(current)
      return acc
    },
    [array[0]],
  )
}

/**
 * Returns an array filled with each number from `start` to `end`, inclusive.
 *
 * @param start
 * @param end
 */
export function range(start: number, end: number): number[] {
  const length = end - start + 1
  return Array.from({length}, (_, i) => start + i)
}

/**
 * Returns elements from the first array that are not in the second array. Returns a new array.
 * @param a - The first array
 * @param b - The second array to compare against
 */
export function diff<T>(a: T[], b: T[]): T[] {
  const set = new Set(b)
  return a.filter((t) => !set.has(t))
}

/**
 * Splits an array into two arrays based on a predicate function. Returns new arrays.
 * @param arr - The array to partition
 * @param fn - The predicate function to determine partition
 */
export function partition<T>(arr: T[], fn: (value: T) => boolean): [T[], T[]] {
  return arr.reduce<[T[], T[]]>(
    ([pass, fail], value) => {
      if (fn(value)) {
        pass.push(value)
      } else {
        fail.push(value)
      }
      return [pass, fail]
    },
    [[], []],
  )
}

export function arrayMoveMutable<T>(
  array: T[],
  sourceIndex: number,
  targetIndex: number,
): T[] {
  const startIndex = sourceIndex < 0 ? array.length + sourceIndex : sourceIndex

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = targetIndex < 0 ? array.length + targetIndex : targetIndex

    const [item] = array.splice(sourceIndex, 1)
    array.splice(endIndex, 0, item)
  }
  return array
}

export function arrayMove<T>(
  array: T[],
  sourceIndex: number,
  targetIndex: number,
): T[] {
  return arrayMoveMutable([...array], sourceIndex, targetIndex)
}
